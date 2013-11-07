module.exports = function(grunt){
    var pkg = grunt.file.readJSON('package.json');
    console.log(pkg.address.plug);
    //配置
    grunt.initConfig({
        pkg:pkg,
        banner: '/*!!\n' +
              '* <%= pkg.name %>.js v<%= pkg.version %>\n' +
              '* Copyright <%= grunt.template.today("yyyy-mm-dd")%>\n'+ 
              '* Author <%= pkg.author %>\n' +
              '* Github <%= pkg.github %>\n' +
              '* Dependent <%=pkg.dependent.lab%>,<%=pkg.dependent.jquery%>,<%=pkg.dependent.underscore%>\n'+
              '*/\n',
        concat:{
          options:{
              banner:'<%=banner%>\n'
          },
          build:{
              src:'<%=pkg.address.plug%>*.js',
              dest:'build/<%=pkg.name%>.ui.js'
          }
        },
        uglify:{
            kalimdor:{
                options:{
                    banner:'<%=banner%> \n '
                },
                files:[
                    {
                        expand: true,
                        cwd: '<%=pkg.address.plug%>',
                        src: ['./*.js'],
                        dest: 'build/plug/',                         
                        ext: '.min.js',
                    },
                    {
                        src:'build/<%=pkg.name%>.ui.js',
                        dest:'build/<%=pkg.name%>.ui.min.js'
                    },
                    {
                        src:'build/<%=pkg.name%>.js',
                        dest:'build/<%=pkg.name%>.min.js'
                    }
                ]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    // 注册任务
    grunt.registerTask('default',['concat','uglify:kalimdor']);   
};


