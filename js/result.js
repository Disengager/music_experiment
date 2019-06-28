function Printer(selector) {
    this.selector = selector;
    this.init = function() {
        $(selector).html('');
        return this;
    };
    this.set = function(text) {
        $(selector).append(text);
    };
    this.progress_bar = function() {
        let current = 0,	
            all = $('#test .question').length;
            

        $('#test input:radio:checked').each(function(id,item){
        	let question_id = $(item).data('id');
            test.questions[question_id].filled = 1;
            $('#progress #progress__item_' + question_id).addClass('check-question');
        });
        $('#test input:checkbox:checked').each(function(id,item){
        	let question_id = $(item).data('id');
            test.questions[question_id].filled = 1;
            $('#progress #progress__item_' + question_id).addClass('check-question');
        });
        $('#test input:text').each(function(id,item){
            if( $(item).val() == "" ) return false;
            let question_id = $(item).data('id');
            test.questions[question_id].filled = 1;
            $('#progress #progress__item_' + question_id).addClass('check-question');
        });

        for(question in test.questions)
        	current += test.questions[question].filled;

        let percent = current / all * 100;

        $('#progress').css('display', 'block');
        $('#progress #progress__bar .module__content').css('width', percent + '%');
        $('#progress #progress__bar .module__title span').html(current + '/' + all);
    	// $('#progress .module__title').css('color', percent > 60 ? 'white' : 'black');
    };
    this.progress_bar_stop = function() {
    	$('#progress').css('display', 'none');
    };

  };