function Spliter(text, question_separator, right_marker) {
    this.text = text;
    this.question_separator = question_separator;
    this.string_separator = "\n";
    this.right_marker = right_marker;
  
    this.separate = function() {
        var questions = [];
        var items = this.text.split(this.question_separator);
        for(item in items) {
            if(items[item] == "") break
            let lines = items[item].split(this.string_separator),
                object = {},
                first_line = 0;
            first_line = lines[0] == "" ? 1 : 0;
            object.question = lines[first_line];
            object.options = [];
            object.right = [];
            object.result = 0;
            object.get_result = function() {
                return parseInt(this.result) >= 1 ? parseInt(this.result) : 0;
            };
            object.filled = 0;
            first_line++;
            for(i = first_line; i < lines.length; i++) {
                if(lines[i] == "") break;
                var option = lines[i];
                if(lines[i][0] == '*') {
                    option = lines[i].split(this.right_marker)[1];
                    object.right.push(option);
                }
                object.options.push(option);
            }
            questions.push(object);
        }
        return (questions);
    };

  };