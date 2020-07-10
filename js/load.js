$( document ).ready(function() {
    test_creater.init();
    var user_name = findGetParameter('user_name'),
        playlist_sort = findGetParameter('playlist_sort');

    if(user_name != null)
        $('#user_name').val(user_name);
    if(playlist_sort != null)
        test_creater.playlist_sort = parseInt(playlist_sort);

    document.getElementById('player_playlist').addEventListener("ended", function(e) {
      test_creater.play_from_playlist();
    }, false);

});

function reverse(i) {
	if(i == 1)
		return 6
	if(i == 2)
		return 5
	if(i == 3)
		return 4
	if(i == 4)
		return 3
	if(i == 5)
		return 2
	if(i == 6)
		return 1

}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

function readTestFile(file)
{
    $.ajax({
        url : '/tests/' + file + '.txt',
        dataType: "text",
        success : function (data) {
            test_creater.create(data);
            console.log(data);
        }
    });
}