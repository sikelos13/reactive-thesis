var gulp = require('gulp');

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {

    // jQuery
    gulp.src([
            './node_modules/jquery/dist/*',
            '!./node_modules/jquery/dist/core.js'
        ])
        .pipe(gulp.dest('./vendor/jquery'))

})

// Default task
gulp.task('default', ['vendor']);