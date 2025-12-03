pipeline{
   agent  any 
   tools{
    nodejs 'node22'
   }

   environment{
    PATH = "/usr/local/bin:${env.PATH}"
  DOCKER_USER = "docdon0007"         // your Docker Hub username
        IMAGE_NAME = "admin"
        IMAGE_TAG = "01"
        DOCKER_IMAGE = "${DOCKER_USER}/${IMAGE_NAME}:${IMAGE_TAG}"  
   }

   stages{
    stage('Checkout'){
         steps {
             git branch :'main' , url: 'https://github.com/Nikhil00-7/admin.git'
         }
    }
    stage('Dependency  Installation'){
         steps{
             sh 'node -v'
                sh 'npm -v'
             sh 'npm install'
         }
    }
    stage('Build'){
         steps{
            sh 'npm run build'
         }
    }
    // stage('Test'){
    //     steps{
    //       sh 'npm test'
    //     }
    

   stage('Docker Login & Push') {
    steps {
                sh "docker build -t $DOCKER_IMAGE ."

        withCredentials([usernamePassword(credentialsId: 'dockerhub-login', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
            sh """
                echo $PASS | docker login -u $USER --password-stdin
                docker push $DOCKER_IMAGE
            """
        }
    }
}

   stage('Deploy'){
     steps{
         echo "Deploying to kubernetes.."
         sh 'kubectl apply -f deployment.yaml'
     }
   }

   stage('Archive Artifacts') {
    steps {
        sh 'mkdir -p artifacts'
        sh 'cp -r build/* artifacts/'
        sh 'cp deployment.yaml artifacts/'
        archiveArtifacts artifacts: 'artifacts/**/*', fingerprint: true
    }
}

   
   }


}