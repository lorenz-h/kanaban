
function new_kana() {
    var keys = Object.keys(game_state.active_chars);
    var key = game_state.curr_romanji;
    
    // this stops the same kana from being shown twice in a row.
    while (key == game_state.curr_romanji){ 
        key = keys[keys.length * Math.random() << 0];
    }
    
    game_state.curr_kana = game_state.active_chars[key];
    game_state.curr_romanji = key;

    $("#char_box").text(game_state.curr_kana);
    $("#answer_box").val("");
};

            
function process_answer() {
    var answer = $('#answer_box').val();
    answer = answer.toLowerCase();
    
    if (answer == game_state.curr_romanji) {
        new_kana();
        $("#game_screen").removeClass("wrong");
        $("#game_screen").addClass("correct");
        game_state.correct_responses += 1;
        update_response_display();
        reset_timeout();
        
        
    } else {
        $("#answer_box").val("");
        $("#game_screen").removeClass("correct");
        $("#game_screen").addClass("wrong");
        game_state.wrong_responses += 1;
        update_response_display();
        reset_timeout()
        
    }
};

function update_response_display(){
    $("#wrong_responses_indicator").text(game_state.wrong_responses);
    $("#correct_responses_indicator").text(game_state.correct_responses);
};

function reset_timeout(){
    clearInterval(game_state.timeout_id)
    game_state.timeout_id = setTimeout(reset_bg_color, 300);
};

var reset_bg_color = function(){
    $("#game_screen").removeClass("correct");
    $("#game_screen").removeClass("wrong");
};

function reveal_answer(){
    $("#char_box").text(game_state.curr_romanji);
    $("#answer_box").val("");
    


    game_state.wrong_responses += 1;
    update_response_display();
    setTimeout(new_kana, 600);
    reset_timeout();
};

function get_active_chars(){
    var active_chars = {};
    charsets.forEach(function (item, index) {
        if (item["active"]){
            const keys = Object.keys(item["chars"]) //iterate over all chars in an active subset
            for (const key of keys) {
                active_chars[key] = item["chars"][key]
            }
        }
      
    });
    console.log("Active Chars:", active_chars)
    return active_chars
}

function create_charset_checkbox(state, name){
    var entity_id = "status_btn_"+name.replace(" ", "_");
    var html_entity = $([
        "<div>",
        "<input type='checkbox' name='"+name+"' id='"+entity_id+"'><label for='"+entity_id+"'>"+name+"</label>",
        "</div>"
    ].join("\n"));
    html_entity.find("input").prop('checked', state);
    return html_entity
};

function populate_settings_menu(){
    $("#chset_status_wrapper").empty();
    charsets.forEach(function (chset, index) {
        var html_entity = create_charset_checkbox(chset["active"], chset["name"])
        console.log("Created settings entry:", html_entity)
        $("#chset_status_wrapper").append(html_entity)
    });
};

function update_charset_states(){
    charsets.forEach(function (chset, index) {
        var entity_id = "#status_btn_"+chset["name"].replace(" ", "_");
        console.log(entity_id, $(entity_id).prop("checked"));
        chset["active"] = $(entity_id).prop("checked");
    });
};

function start_game(){
    game_state = {
        curr_kana: "",
        curr_romanji: "",
        timeout_id: 0,
        correct_responses: 0,
        wrong_responses: 0,
        active_chars: get_active_chars()
    };

    console.log("Starting game...")
    $("#main_menu").addClass("hide");
    $("#game_screen").removeClass("hide");
    $("#answer_box").focus();

    
    new_kana();
    update_response_display();
};

function stop_game(){
    $("#game_screen").addClass("hide");
    $("#main_menu").removeClass("hide");
    $("#answer_box").val("");
};
