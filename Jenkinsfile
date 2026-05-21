pipeline {

    agent any

    stages {

        stage('Clone') {
            steps {
                git branch: 'develop',
                url: 'YOUR_GITHUB_REPO'
            }
        }

        stage('Backend Install') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Frontend Install') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('server') {
                    sh 'npm run build'
                }
            }
        }

        stage('Frontend Build') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Run Migration') {
            steps {
                sh 'docker compose exec backend npm run migrate'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker compose up -d --build'
            }
        }

    }
}