var charsets = hiragana_charsets.concat(katakana_charsets); 


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
        
        game_state.streak += 1;
        update_best_streak();
        update_stats_display();
        reset_timeout();
        
        
    } else {
        $("#answer_box").val("");
        $("#game_screen").removeClass("correct");
        $("#game_screen").addClass("wrong");
        
        update_best_streak();
        game_state.streak = 0
        update_stats_display();
        reset_timeout()
        
    }
};

function update_best_streak(){
    if (game_state.streak > game_state.best_streak){
        game_state.best_streak = game_state.streak
    }
}

function update_stats_display(){
    $("#streak_indicator").text(game_state.streak);
    $("#best_streak_indicator").text(game_state.best_streak);
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
    

    update_stats_display();
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

function create_charset_checkbox(state, name, system){
    var entity_id = "status_btn_"+system+"_"+name.replace(" ", "_").replace(".", "_");
    var html_entity = $([
        "<div>",
        "<input type='checkbox' name='"+name+"' id='"+entity_id+"'><label for='"+entity_id+"'>"+name+"</label>",
        "</div>"
    ].join("\n"));
    html_entity.find("input").prop('checked', state);
    return html_entity
};

function populate_settings_menu(){
    $("#hiragana_status_wrapper").empty();
    $("#katakana_status_wrapper").empty();
    charsets.forEach(function (chset, index) {
        var html_entity = create_charset_checkbox(chset["active"], chset["name"], chset["system"])
        console.log("Created settings entry:", html_entity)
        if (chset["system"] == "Hiragana"){
            $("#hiragana_status_wrapper").append(html_entity)
        } else {
            $("#katakana_status_wrapper").append(html_entity)
        }
        
    });
};

function update_kana_sys_children(system=String){

    if (system == "Hiragana"){
        var status = $("#hiragana_global_tog").prop("checked");
    } else {
        var status = $("#katakana_global_tog").prop("checked");
    }
    console.log("Updating all sets of system", system, "to status", status);
    
    charsets.forEach(function (chset, index) {
        if (chset["system"] == system){
            var entity_id = "#status_btn_"+system+"_"+chset["name"].replace(" ", "_").replace(".", "_");
            // console.log(entity_id, status);
            chset["active"] = status;
            $(entity_id).prop("checked", status);
        }
        
    });
};


function update_charset_states(){
    charsets.forEach(function (chset, index) {
        var entity_id = "#status_btn_"+chset["system"]+"_"+chset["name"].replace(" ", "_").replace(".", "_");
        console.log(entity_id, $(entity_id).prop("checked"));
        chset["active"] = $(entity_id).prop("checked");
    });
};


function start_game(){
    game_state = {
        curr_kana: "",
        curr_romanji: "",
        timeout_id: 0,
        streak: 0,
        best_streak: 0,
        active_chars: get_active_chars()
    };

    console.log("Starting game...")
    $("#main_menu").addClass("hide");
    $("#game_screen").removeClass("hide");
    $("#answer_box").focus();

    
    new_kana();
    update_stats_display();
};

function stop_game(){
    $("#game_screen").addClass("hide");
    $("#main_menu").removeClass("hide");
    $("#answer_box").val("");
};
