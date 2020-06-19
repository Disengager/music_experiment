var test_creater = {
    test_id: 0, //0 - rotation, 1 - toav
    index: -1,
    time: 0, //время
    timer_status: false,
    current_list: [], //список текущих
    rotation_list: ['manual_1', 'rot_1', 'manual_2'],
    toav_list: ['toav_manual_1', '', ''],
    right: '',
    playlist_sort: 1,
    playlist_index: 0,
    audio_list: [],

    init: function() {
        this.set_list_by_id();
        this.next();

    },
    set_list_by_id: function() {
        this.current_list = this.test_id == 0? this.rotation_list : this.toav_list
    },
    set_to_playlist: function(button) {
        if($(button).html() == '+') {
            exsist = false;
            audio_current = $('#' + $(button).attr('for'))
            for (audio in this.audio_list) {
                if($(this.audio_list[audio]).attr('id') == $(audio_current).attr('id'))
                    exsist = true
            }
            if(!exsist)
                this.audio_list.push(audio_current);

            $(button).html('-')   

            
        } else {
            exsist = false;
            audio_current = $('#' + $(button).attr('for'))
            for (audio in this.audio_list) {
                if($(this.audio_list[audio]).attr('id') == $(audio_current).attr('id'))
                    exsist = audio
            }
            if(exsist)
                this.audio_list.splice(exsist , 1);
            $(button).html('+')  
        }
        this.audi_block_render();
    },
    audi_block_render: function() {
        this.audio_list_sort(this.playlist_sort);
        $('.playlist').html('');
        for (audio in this.audio_list) {
            selector = $(this.audio_list[audio]).attr('id').split('player_')[1];
            $('.playlist').append('<div class="playlist_item">' +  $('#' + selector).html() + '</div>')
        }
    },
    next: function(answer) {
        if(this.is_right(answer))
            return false
        this.in_next(answer);

    },
    in_next: function(answer) {
        this.index++;
        if(this.index > this.current_list.length-1) {
            
            if(!this.is_rotation())
                return this.end()

            //запуск тоав
            this.load_following_test();
        }
        this.render()
    },
    start: function() {
        $([document.documentElement, document.body]).animate({
            scrollTop: $("#current").offset().top
        }, 1100);

        this.timer_enable();

        $('.audio_list span').attr('class', 'play-button');

        $( '.audio_list span' ).each(function( index ) {
            document.getElementById('player_' + $(this).attr('id')).pause();
        });

        $( '.audio_list .plus_button' ).each(function( index ) {
            $(this).css('display', 'none');
        });

        this.play_from_playlist();
    },
    end: function() {

    },
    is_toav: function() {
        return this.test_id == 1;
    },
    is_rotation: function() {
        return this.test_id == 0;   
    },
    is_right: function(answer) {
        if(this.index == -1)
            return false

        if(this.current_list[this.index] == undefined)
            return false

        if(parseInt($('#' + this.current_list[this.index] + ' .right').html()) == 0)
            return false

        if(parseInt($('#' + this.current_list[this.index] + ' .right').html()) == answer) {
            $('#current .module__title').html('Верно');
            setTimeout('test_creater.in_next(' + answer + ')', 600);
            return true
        }
        else {
            $('#current .module__title').html('Не верно');
            setTimeout('test_creater.in_next(' + answer + ')', 600);
            return true
        }
    },
    load_following_test: function() {
        this.time = 0;
        this.test_id++;
        this.index = 0;
        this.set_list_by_id();  
    },
    render: function() {
        $('#current').html($('#' + this.current_list[this.index]).html());

    },
    play_form_music: function(button) {
        if($(button).attr('class') == 'pause-button') {
            document.getElementById('player_' + $(button).attr('id')).pause();
            $(button).attr('class', 'play-button');
            return true;
        }

        $('.audio_list span').attr('class', 'play-button');
        $(button).attr('class', 'pause-button');
        $( '.audio_list span' ).each(function( index ) {
            document.getElementById('player_' + $(this).attr('id')).pause();
        });
        document.getElementById('player_' + $(button).attr('id')).play();
    },
    play_from_playlist: function() {
        if(this.audio_list.length < 1)
            return false

        if(this.playlist_index == this.audio_list.length)
            this.playlist_index = 0;

        document.getElementById('player_playlist').setAttribute('src', this.audio_list[this.playlist_index].attr('src'));
        document.getElementById('player_playlist').play();

        this.playlist_index++;
    },
    audio_list_sort: function(sort_type) {
        var sort_arr = [];

        for (audio in this.audio_list) {
            sort_arr.push(parseInt($(this.audio_list[audio]).attr('id').split('player_music_')[1]));           
        }
        if(sort_type == 1)
            sort_arr.sort();
        else
            sort_arr.sort((a, b) => b - a);

        result_arr = [];

        for (number in sort_arr) {
            for(audio in this.audio_list) {
                if($(this.audio_list[audio]).attr('id') == 'player_music_' + sort_arr[number]) {
                    result_arr.push(this.audio_list[audio]);
                    break;

                }
            }
        }

        this.audio_list = result_arr;

    },
    timer_enable: function() {
        this.timer_status = true;
        this.time = 0;
        this.timer();
    }, 
    timer_disable: function() {
        this.timer_status = false;
        return this.time;
    },
    stop: function() {
        // this.check();
        this.timer_disable();
        // new Printer('#stat').progress_bar_stop();
    },
    timer: function() {
        if(!this.timer_status) return false;
        this.time++;
        var me = this;
        setTimeout(function () {
            me.timer();
        }, 1000);
    },
}

                                                                                                                                                                                                                                       
document.onkeydown = function(e) {
    switch(e.which) {
        case 37: // left
            test_creater.next(1)
        break;

        case 39: // right
            test_creater.next(2);
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); 
};


function pause (ms) {
    if (ms<=0) return;
    var now = new Date();
    now.setTime (now.getTime()+ms);
    var end=now.getTime();
    do {
    now = new Date();
    } while (now.getTime()<end);
}


