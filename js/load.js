$( document ).ready(function() {
    var questionText = localStorage.getItem('question-text');
    $('#filter #question-text').val(questionText);

    $('#filter input:checkbox').each(function(id,item) {
        let checkVal = localStorage.getItem( $(this).attr('id') );
        $(this).prop('checked', checkVal == 'true');
        test.filter[$(this).attr('id')].show = checkVal == 'true'
        ;
        $(this).on('change', function() {
            test.filter[$(this).attr('id')].show = this.checked;
            localStorage.setItem($(this).attr('id'), this.checked);    
        })
    });

    $( window ).scroll(function() {
        if($('#test').offset().top - 50 < $(window).scrollTop()) {
            if(test.filter['show-progress'].fixed) return false;

            $('#progress').css('position', 'fixed');
            $('#progress #progress__table').css('position', 'fixed');
            $('#test').css('margin', '50px 0 0 0');
            test.filter['show-progress'].fixed = true;
        } else {
            if(!test.filter['show-progress'].fixed) return false;

            $('#progress').css('position', 'initial');
            $('#progress #progress__table').css('position', 'initial');
            $('#test').css('margin', '20px 0 0 0');
            test.filter['show-progress'].fixed = false;
        }
        
        
    });

    window.saveMemo = function() {
        var questionText = $('#filter #question-text').val();
        localStorage.setItem('question-text', questionText);
    }

    window.randomInteger = function (min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }
    
    window.setEventInputTypes = function(types) {
        for(type_id in types) {
            $("#test input:"+ types[type_id]).change(function() {
                if(test.filter['show-progress'].show) 
                    new Printer('#stat').init().progress_bar();
                if(test.filter['show-right-response'].show)
                    test.check();
            });
        }
    }

    window.checkEventListener = function () {
        setEventInputTypes(['radio', 'checkbox', 'text']);
    }

    window.addFlexScroll = function() {
        $('a[href^="#"]').on('click', function(event) {
            event.preventDefault();
            
            var sc = $(this).attr("href"),
                dn = $(sc).offset().top - 30;
            $('html, body').animate({scrollTop: dn}, 700);
            
        });    
    }   

    window.num2str = function(n, text_forms) {  
        n = Math.abs(n) % 100; var n1 = n % 10;
        if (n > 10 && n < 20) { return text_forms[2]; }
        if (n1 > 1 && n1 < 5) { return text_forms[1]; }
        if (n1 == 1) { return text_forms[0]; }
        return text_forms[2];
    }
});
