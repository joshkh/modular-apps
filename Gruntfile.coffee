module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        apps_c:
            commonjs:
                src: [ 'src/**/*.{coffee,js,eco}' ]
                dest: 'build/app.js'
                options:
                    main: 'src/main.js'
                    name: 'MyFirstCommonJSApp'

        concat:
            scripts:
                src: [
                    'vendor/jquery/jquery.js'
                    'vendor/underscore/underscore.js'
                    'vendor/backbone/backbone.js'
                    'vendor/q/q.js'
                    'vendor/imjs/js/im.js'
                    'build/app.js'
                ]
                dest: 'build/app.bundle.js'
                options:
                    separator: ';' # we will minify...

    grunt.loadNpmTasks('grunt-apps-c')
    grunt.loadNpmTasks('grunt-contrib-concat')

    # Will build mori too.
    grunt.registerTask('default', [
        'apps_c'
        'concat'
    ])

    # Use when watching...
    grunt.registerTask('build', [
        'apps_c'
        'concat'
    ])