import groovy.json.JsonOutput

pipeline {
    agent any
    
    // set env
    environment {
        language = "js,ts"
        NODE_PATH = '/home/deploy/node/lib/node_modules'
        project_name =  sh(returnStdout: true, script: 'echo ${GIT_URL#*/}|sed "s/.git//g"').trim()
        gitlab_branch = sh(returnStdout: true, script: 'echo ${GIT_BRANCH}|sed "s/\\//-/g"').trim()
        sq_id = "${project_name}_${gitlab_branch}"
        //sq扫描代码开关 1代表开启,0代表关闭
        is_sonarqube_scan = "1"
        
    }
    
    // set triggers
    triggers {
        gitlab(
            triggerOnPush: true,
            triggerOnMergeRequest: true,
            triggerOnNoteRequest: true,
            branchFilterType: 'All',
            secretToken: 'asdfghjkl'
        )
    }
    
    // parameters
    //parameters {
    //    gitParameter name: 'BRANCH_TAG', 
    //                 type: 'PT_BRANCH_TAG',
   //                  branchFilter: 'origin/(.*)',
    //                 defaultValue: 'master',
   //                  selectedValue: 'DEFAULT',
   //                  sortMode: 'DESCENDING_SMART',
    //                 description: 'Select your branch or tag.'
    //}
    
    // set options
    options {
        // 同一个pipeline，Jenkins默认是可以同时执行多次的，此选项为了禁止pipeline同时执行
        disableConcurrentBuilds() 
        gitLabConnection('hydevops-gitlab-conn')
    }
    stages {
        //stage('checkout') {
        // steps{
       //     checkout scm
       //  }
       // }
        stage('print env') {
          steps {
            //sh 'tsc -v'
            //sh 'npm list -g typescript'
            sh 'printenv'
          }
        }
        //代码静态扫描
        stage('SonarQube Scanner') {
            when {
                expression {
                    return is_sonarqube_scan == "1"
                }
            }
            steps {
                withSonarQubeEnv('hydevops-sonarqube'){
                    script{
                        def sonarScanner = tool name: 'hydevops-sonarqube-scanner'
                        sh  "${sonarScanner}/bin/sonar-scanner " +
                        "-Dsonar.projectKey=${sq_id} " +
                        "-Dsonar.projectName=${sq_id}  " +
                        "-Dsonar.projectVersion=${env.GIT_COMMIT} " +
                        "-Dsonar.language=${language} " +
                        "-Dsonar.sourceEncoding=UTF-8 " +
                        "-Dsonar.sources=${env.WORKSPACE} " +
                        "-Dsonar.exclusions=**/__test__/**/*.* " + 
                        "-Dsonar.exclusions=**/demo/**/*.* " + 
                        "-Dsonar.exclusions=**/.bak/**/*.* " + 
                        "-Dsonar.exclusions=**/*.bak.* " + 
                        "-Dsonar.exclusions=**/*.bak " + 
                        "-Dsonar.exclusions=**/.template/**/*.* " + 
                        "-Dsonar.eslint.eslintconfigpath=.eslintrc "+
                        "-Dsonar.eslint.ruleconfigs=.eslintrc "
                    }
                }    
            } 
        }
    }
    post {
        success {
            // 发邮件通知
            timeout(30){
                script {
                    def mail_succ_url = "http://192.168.8.88:28243/hydevops_notify_platform/api/v1/mail/jenkins/success"
                    def sq_show_result = "http://192.168.14.121:9000/dashboard?id=${project_name}&branch=${env.GIT_BRANCH}&resolved=false"
                    def toJson = {
                        input -> JsonOutput.toJson(input)
                    }
                    def change_user  = get_change_author()
                    def mail_to = "${change_user}@haoyuntech.com"
                    def param_dict =[
                        "project_name": "${project_name}",
                        "branch": "${env.GIT_BRANCH}",
                        "job_name": "${env.JOB_NAME}",
                        "build_num": "${env.BUILD_NUMBER}",
                        "mail_to": "${mail_to}",
                        "is_sonarqube_scan": is_sonarqube_scan,
                        "changes": "${env.RUN_CHANGES_DISPLAY_URL}",
                        "run_display": "${env.RUN_DISPLAY_URL}",
                        "show_detail": "${sq_show_result}"   
                    ]
                    println(param_dict)
                    //response = httpRequest consoleLogResponseBody: true, contentType: 'APPLICATION_JSON', httpMode: 'POST', requestBody: toJson(param_dict), url: mail_succ_url, validResponseCodes: '200' 
                }
            }            
        }
    }
}

//test
@NonCPS
def get_change_author() {
    echo "Gathering SCM changes"
    def changeLogSets = currentBuild.changeSets
    def author = "unKnow"
    if (changeLogSets.size() > 0){
        def last_idx = changeLogSets.size() - 1
        def entries = changeLogSets[last_idx].items
        def last_entries_idx = entries.length - 1
        def entry = entries[last_entries_idx]  
        author = entry.author.toString()
    }
    return author
}
