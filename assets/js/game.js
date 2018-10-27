$(document).ready(function(){
        /*******GLOBAL VARIABLES 
            fighter: will hold the fighter instance of the character object
            defender: will hold the defender instance of the character object
            enemeyChosedAlready : a bolean to be used to stop chosing an enemy if there is one 
                                  already been taken.
            playerChoosedAlready : a bolean to be used to stop chosing a fighter if there is one
                                  already been taken.
        */
       var fighter, defender, enemeyChosedAlready=false, playerChoosedAlready=false;

    //click the begin button 
    $("#bgn").click(function(){

        //animating the tags
        $(".content").show(1000);
        $("#attack,#deffend,#begin,#enemies,#begin,.game-begin").hide(1000);

        //an array to hold the characters objects
        var charArray=[];
        //an object will hold the characters of the game
        var Character = (function(name,title,helthpoints,attack_power,counter_attack_power){
            /*
            character variables
            name will hold a string of the character name without spacing-used for id of elements
            title will hold the name of the character including spaces and capital letters
            healthpoints hold the HP of the character
            attack_power hold the power that the fighter use it to attack
            counter_attack_power holds the power that used by the enemy against the fighter
            fight_power() function will increment the HP and increase the attack power of the fighter
                based on his attack_power value
            defend_power() function to be used by the enemy to decrease the fighter power by a constant amount
            */
            this.name = name;
            this.title = title;
            this.helthpoints = helthpoints;
            this.attack_power = attack_power;
            this.counter_attack_power = counter_attack_power;
        });
        $.extend(Character.prototype,{

            //funciton to decrease the fighter health and increase his attack power
             fighter_power:function(points,def_counter_attack,base){
                points -=def_counter_attack; 
                this.attack_power =this.attack_power + base;
                return points;
            },

            //funciton to decrease the defender health
             defend_power:function(power,fighter_power){
                return power - fighter_power;
            }
        });

        //function to generate the characters and assign them to dives
        function generate(){
            charArray =[
                new Character("stormtrooper","Storm Trooper",180,7,18),
                new Character("clonetrooper","Clone Trooper",110,8,12),
                new Character("obiwan","Obi Wan",90,5,10),
                new Character("yoda","Yoda",130,12,15),
            ];

            for(var i=0;i<4;i++){
                //set div for each character
                $(".playerfield").append("<div class=\"player\"><h6>"+charArray[i].title+"</h6><div class=\"imgdiv\"><img src=\"./assets/images/"+charArray[i].name+".jpg\" ><h5 id=\""+charArray[i].name+"\">"+charArray[i].helthpoints+"</h5><span style='display:none' id='index'>"+i+"</span></div></div>");
                //animate the player div
                $(".playerfield").find(".player").hide().show(1000);
            }
        }

        //calling generate to build the characters
        generate();

        $(".playerfield").on("click","div.player",function(){
            if(playerChoosedAlready){
                return false;
            }
            //hide the player list title
            $('#selectplayer').hide();
            playSound("./assets/media/chose.mp3");
            playerChoosedAlready = true;
            $("#enemies").show(1000);

            //change the dive chosen to be fighter to .fighter so it won't be available to click
            $(this).attr("class","fighter");
            //transfer all the other players to anther container called enemypool
            $(".enemypool").append($(".playerfield").find(".player"));

            $(".playerfield").find(".player").remove();

            //animate the player div
            $(".player").hide().show(1000);
            //creating the fighter
            fighter = charArray[parseInt($(".playerfield").find("#index").text())];
            //set the base to the fighter attack power
            base = fighter.attack_power;
        });
        $(".enemypool").on("click","div.player",function(){
                if(enemeyChosedAlready){
                    return false;
                }
                playSound("./assets/media/chose.mp3");
                $("#attack, #begin, #deffend").show(1000);

                enemeyChosedAlready = true;
                
                $(this).attr("class","deffender");
                $(".defenderpool").append($(".deffender"));
                $(".enemypool").find(".deffender").remove();
                $(".deffender").hide().show(1000);
                $('#pwin, #enemies').hide();

                //creating deffender
                defender = charArray[parseInt($(".defenderpool").find("#index").text())];
        });
        $("#attack").on("click",function(){
            if(!enemeyChosedAlready){
                return false;
            }
            //filling fighting information
            $('#pattack, #dattack').show();
            $('#pattack').text("you attacked "+defender.title+" for "+fighter.attack_power + " damage.");
            $('#dattack').text(defender.title + " attacked you back for " + defender.counter_attack_power + " damage.")
            //hide the begin fight text
            $('#begin').hide();
            playSound("./assets/media/sword.wav");
            //modifing the health of both fighter and deffender at each click
            defender.helthpoints = defender.defend_power(defender.helthpoints,fighter.attack_power);            
            fighter.helthpoints = fighter.fighter_power(fighter.helthpoints,defender.counter_attack_power,base);

            //displying the health points for fighter and deffender
            $(".defenderpool").find('#'+defender.name).text(defender.helthpoints);
            $('#'+fighter.name).text(fighter.helthpoints);

            //in case the deffender lost his health
            if(defender.helthpoints <= 0 && fighter.helthpoints > 0){
                //show the player win text 
                $('#pwin').show();
                //show the title to choose an enemy
                $('#enemies').show();
                //empty the deffenders container
                $(".defenderpool").empty();
                $('#pwin').text("You deffeted "+defender.title+" ,chose another enemy to fight");
                $(".deffender, #pattack, #dattack").hide(1000);
                enemeyChosedAlready = false;
                fighter.attack_power = base;
            }

            //in case the fighter lost his health
            else if(fighter.helthpoints <= 0){
                //hide all the h tags which hold the titles of the containers
                $("#attack, #deffend,#begin, #enemies, #pattack, #dattack, #pwin").hide(1000);
                //remove the deffender div
                $(".deffender").remove(); 
                //show the modal with a message
                $('.modal-body').append("<img src='./assets/images/"+ defender.name +".jpg' style='width:200px; height: 200px;'><h2>"+defender.title + "</h2>");
                $(".modal-body").append("<h2>  defeated you, try again.</h2>")
                $('#exampleModalCenter').modal('show'); 

            }

            //check if the fighter won
            if($('.enemypool').children().length == 0 && $('.defenderpool').children().length == 0 && fighter.helthpoints > 0){
                $("#attack, #deffend, #begin, #enemies, #pattack, #dattack").hide(1000);
                //show the modal
                $(".modal-body").append("<img src='./assets/images/"+ fighter.name +".jpg' style='width:200px; height: 200px;'><h2> CONGRAGULATIONS!!</h2><h2>you defeated all your enemeies.</h2>")
                $('#exampleModalCenter').modal('show'); 
            }
        });

        //function to play sound
        function playSound(song){
            var audio = new Audio(song);
            audio.play();
            audio.currentTime -= 50.0;

        }

        //click close button in the modal
        $("#close").click(function(){
            //reseting everything
            $(".content").hide(1000);
            $(".game-begin").show(1000);
            location.reload();
        });

        //click the play again button
        $("#playagain").click(function(){
            //reseting game variables
            enemeyChosedAlready = false;
            playerChoosedAlready = false;    
            $(".modal-body").empty();
            $(".player,.deffender,.fighter").remove();
            generate();
            $('#exampleModalCenter').modal('hide'); 
            $('#selectplayer').show();
        });
    });
   
    
});