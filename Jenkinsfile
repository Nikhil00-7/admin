pipeline{

   tools{
    nodejs 'node22'
   }

   environment{
    DOCKER_IMAGE = 'admin:01'    
   }

   stages{
    stage('Checkout'){
         steps {
             git branch :'main' , url: 'https://github.com/Nikhil00-7/admin.git'
         }
    }
    stage('Dependency  Installation'){
         steps{
             sh 'npm install'
         }
    }
    stage('Build'){
         steps{
            sh 'npm run build'
         }
    }
    stage('Test'){
        steps{
          sh 'npm test'
        }
    }

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
         sh 'kubectl apply -f k8s-deployment.yaml'
     }
   }
   
   }


}