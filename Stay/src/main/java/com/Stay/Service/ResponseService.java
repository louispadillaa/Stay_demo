package com.Stay.Service;

import com.Stay.Entity.*;
import com.Stay.Repository.QuestionRepository;
import com.Stay.Repository.ResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;


@Service
public class ResponseService {

    @Autowired
    private ResponseRepository responseRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private AlertService alertService;

    public void registerResponses(Survey survey, List<Response> responses){
        //Guardar respuestas en base de datos
try{
        for (Response response : responses) {
            // Obtener la pregunta de la base de datos usando su ID
            Long questionId = response.getQuestion().getQuestionId();
            Question question = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Question not found with ID: " + questionId));

            // Asociar la encuesta y la pregunta a la respuesta
            response.setSurvey(survey);
            response.setQuestion(question);
            // Guardar la respuesta con la pregunta asignada
            responseRepository.save(response);
        }
        generateAlertIfNeeded(survey);
    }catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Error al regitrar respuestas: " + e.getMessage());
        }
    }

    public void generateAlertIfNeeded(Survey survey){

        //Obtener respuestas afirmativas agrupadas por categoría
        List<Response> responses = responseRepository.findBySurveyAndResponseTrue(survey);
        System.out.println("Respuestas afirmativas: " + responses.size());

        if(responses.isEmpty()){
            return; //No hay respuestas que procesar
        }

        // Filtrar respuestas que tengan preguntas y categorías no nulas
        Map<Category, Long> countByCategory = responses.stream()
                .filter(r -> r.getQuestion()!=null && r.getQuestion().getCategory() != null) // Filtro de seguridad
                .collect(Collectors.groupingBy(r -> r.getQuestion().getCategory(),Collectors.counting()));

        Set<String> keywords = new HashSet<>(Arrays.asList("estrés", "cansancio", "depresión", "frustración", "ansiedad", "Matemáticas"));

        //Generar alerta si el conteo de una categoría excede el lumbral
        countByCategory.forEach((Category, count) ->  {
            int umbral = 3; //Si un estudiante responde al menos 2 preguntas con sí en una categoría, se genera una alerta.
            if(count >= umbral){
                String description = "El estudiante presentó una alerta: ' " + Category.toString().toLowerCase() + "' porque ha respondido afirmativamente a las siguientes preguntas: ";
                StringBuilder questionsBuilder = new StringBuilder();
                List<String> keywordFound = new ArrayList<>();

                responses.stream()
                        .filter(r -> r.getQuestion().getCategory() == Category)
                        .forEach(r -> {
                            // Agregar cada pregunta a la descripción
                            questionsBuilder.append("\n'").append(r.getQuestion().getQuestion()).append("'");

                            // Extraer las palabras clave de cada pregunta y respuesta
                            List<String> keywordsInQuestion = extractKeywords(r.getQuestion().getQuestion(), keywords);
                            keywordFound.addAll(keywordsInQuestion);
                        });

                // Agregar las preguntas a la descripción
                description += questionsBuilder.toString();

                // Agregar palabras clave encontradas a la descripción
                if (!keywordFound.isEmpty()) {
                    description += "\nEl estudiante se ve afectado por: " + String.join(", ", keywordFound +",");
                }

                // Genera la alerta con el porcentaje
                alertService.generateAlert(survey, Category, (int)(count * 25), description); //Genera porcentaje
            }
        });
    }

    // Función para extraer palabras clave de un texto
    private List<String> extractKeywords(String text, Set<String> keywords) {
        List<String> foundKeywords = new ArrayList<>();
        for (String keyword : keywords) {
            if (text.toLowerCase().contains(keyword)) {
                foundKeywords.add(keyword);
            }
        }
        return foundKeywords;
    }
}
