class rotate_class {
    constructor(index) {
        this.index = index,
        this.mark = 0,
        this.angle = 0, 
        this.keyboard = 0,
        this.time = 0
    }
    get_types() {
        return ['<TIMEOUT>', '<LARROW>', '<RARROW>']
    }
    set_key(code) {
        this.keyboard = this.get_types()[code];
    }

    set_key_from_mark() {
        this.set_key(this.mark);
    }

    set_time(val) {
        this.time = val.time;
        val.time = 0;
    }
};

class rotate_list {
   constructor(start_try) {
        this.content = [];
        this.try = -4;
        this.headers = {
            index: "Try",
            mark: "Mark",
            angle: "Angle",
            keyboard: "Key",
            time: "Time",
        };
   } 

   get_by(index) {
        this.content[index]
   }

   get_by_last() {
        return this.content[this.content.length-1];
   }

   not_null() {
        return this.content.length > 0;
   }

   backup() {
        localStorage.setItem('rotate_list', JSON.stringify(this));
   }

   add_content(item) {
        this.content.push(item);
        this.backup();
   }
   convert_to_csv(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line != '') line += ','

                line += array[i][index];
            }

            str += line + '\r\n';
        }

        return str;
   }
   render_to_table() {
        var items = this.content;
        items.unshift(this.headers);

        var jsonObject = JSON.stringify(items),
            csv = this.convert_to_csv(jsonObject),
            link = document.createElement("a"),
            exportedFilenmae = 'rotation.csv',
            blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });


        console.log(jsonObject);
        console.log(csv);

        if (link.download !== undefined) { 
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    } 
}

var test_creater = {
    test_id: 0, //0 - rotation, 1 - toav
    index: -1,
    time: 0, //время
    timer_status: false,
    timer_time: false,
    current_list: [], //список текущих
    rotation_list: ['manual_1', 'rot_1', 'rot_2', 'rot_3', 'rot_4', 'manual_2'],
    toav_list: ['toav_manual_1', 'toav_1', 'toav_2', 'toav_3'],
    right: '',
    playlist_sort: 1,
    playlist_index: 0,
    rotate_info: new rotate_list(-4),
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

            $(button).html('-');   
           
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

        this.in_next(answer, this.is_right(answer)? 1 : 0);
    },
    in_next: function(answer, is_right) {
        this.timer_time = false;
        this.index++;
        
        if(this.index > 0)
            if(this.is_rotation) //запуск ротейта
                this.start_rotate(answer, is_right);

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
        this.start_rotate(-1, 0);
    },
    start_rotate: function(answer, is_right) {
		// задача на ментальное вращение фигуры
        if(this.rotate_info == undefined)
            this.rotate_info = new rotate_list(-4)

        this.rotate_info.try++;
        let rotate = new rotate_class(this.index);
 
        if(answer > -1 && this.index > 1) 
            rotate.mark = is_right; 

        rotate.set_key(answer);
        rotate.set_time(this);

        // this.rotate_info.angle.push();
        this.rotate_info.add_content(rotate);
		console.log(this.rotate_info);
    },
    end: function() {
        this.rotate_info.render_to_table();
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
            this.timer_time = true;
            setTimeout('test_creater.in_next(' + answer + ', 1)', 600);
            return true
        }
        else {
            $('#current .module__title').html('Не верно');
            this.timer_time = true;
            setTimeout('test_creater.in_next(' + answer + ', 0)', 600);
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
        }, 1);

        this.timeout();
    },
    timeout: function(){
        if(this.time < 3000)
            return false

        if(this.time == 3000)
            this.next(0);
        // this.timer_disable();

        return true
    },
}

                                                                                                                                                                                                                                       
document.onkeydown = function(e) {
    if(test_creater.timer_time)
        return false;

    switch(e.which) {
        case 37: // left
            test_creater.next(1);
        break;
        case 38:
            test_creater.next(1);
        break;        
        case 39: // right
            test_creater.next(2);
        break;
        default: 
        return; // exit this handler for other keys
    }
    e.preventDefault(); 
    
        // test_creater.rotate_info.set_code_to_last(e.which);
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


