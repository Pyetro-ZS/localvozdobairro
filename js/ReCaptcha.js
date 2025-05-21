import com.google.cloud.recaptchaenterprise.v1.RecaptchaEnterpriseServiceClient;
import com.google.recaptchaenterprise.v1.Assessment;
import com.google.recaptchaenterprise.v1.CreateAssessmentRequest;
import com.google.recaptchaenterprise.v1.Event;
import com.google.recaptchaenterprise.v1.ProjectName;
import com.google.recaptchaenterprise.v1.RiskAnalysis.ClassificationReason;
import java.io.IOException;

public class CreateAssessment {

  public static void main(String[] args) throws IOException {
    // O que fazer: substitua o token e as variáveis de ação reCAPTCHA antes de executar a amostra.
    String projectID = "voz-do-bairro";
    String recaptchaKey = "6LfKrUMrAAAAABptNEVW52j18K4tcxE_cgAGnyNd";
    String token = "action-token";
    String recaptchaAction = "action-name";

    createAssessment(projectID, recaptchaKey, token, recaptchaAction);
  }

  /**
   * Crie uma avaliação para analisar o risco de uma ação da interface.
   *
   * @param projectID : O ID do seu projeto do Google Cloud.
   * @param recaptchaKey : A chave reCAPTCHA associada ao site/app
   * @param token : O token gerado obtido do cliente.
   * @param recaptchaAction : Nome da ação correspondente ao token.
   */
  public static void createAssessment(
      String projectID, String recaptchaKey, String token, String recaptchaAction)
      throws IOException {
    // Crie o cliente reCAPTCHA.
    // TODO: armazena em cache o código de geração do cliente (recomendado) ou a chamada client.close() antes de sair do método.
    try (RecaptchaEnterpriseServiceClient client = RecaptchaEnterpriseServiceClient.create()) {

      // Defina as propriedades do evento que será monitorado.
      Event event = Event.newBuilder().setSiteKey(recaptchaKey).setToken(token).build();

      // Crie a solicitação de avaliação.
      CreateAssessmentRequest createAssessmentRequest =
          CreateAssessmentRequest.newBuilder()
              .setParent(ProjectName.of(projectID).toString())
              .setAssessment(Assessment.newBuilder().setEvent(event).build())
              .build();

      Assessment response = client.createAssessment(createAssessmentRequest);

      // Verifique se o token é válido.
      if (!response.getTokenProperties().getValid()) {
        System.out.println(
            "The CreateAssessment call failed because the token was: "
                + response.getTokenProperties().getInvalidReason().name());
        return;
      }

      // Verifique se a ação esperada foi executada.
      if (!response.getTokenProperties().getAction().equals(recaptchaAction)) {
        System.out.println(
            "The action attribute in reCAPTCHA tag is: "
                + response.getTokenProperties().getAction());
        System.out.println(
            "The action attribute in the reCAPTCHA tag "
                + "does not match the action ("
                + recaptchaAction
                + ") you are expecting to score");
        return;
      }

      // Consulte a pontuação de risco e os motivos.
      // Para mais informações sobre como interpretar a avaliação, acesse:
      // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
      for (ClassificationReason reason : response.getRiskAnalysis().getReasonsList()) {
        System.out.println(reason);
      }

      float recaptchaScore = response.getRiskAnalysis().getScore();
      System.out.println("The reCAPTCHA score is: " + recaptchaScore);

      // Consiga o nome da avaliação (ID). Use isso para anotar a avaliação.
      String assessmentName = response.getName();
      System.out.println(
          "Assessment name: " + assessmentName.substring(assessmentName.lastIndexOf("/") + 1));
    }
  }
}
