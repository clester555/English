class GameScene extends Phaser.Scene{
    

    constructor(){
        super ({key:"gameScene"});

    }

    preload(){
        let wordList = ["circle","dot","heart","line","oval","rectangle","square","star","triangle"]
        let secretWordList = ["drum","rabbit","draw","ground","frog"];
        this.words = [];
        this.secretWords = [];
        
        for(let i = 0; i<wordList.length;i++){
            this.words[i] = new Word(wordList[i]);
            this.words[i].setImage(this.load.image(wordList[i]+"Image", "assets/images/"+wordList[i]+".png"));
            this.words[i].setAudio(this.load.audio(wordList[i]+"Audio", ["assets/sounds/"+wordList[i]+".mp3",
                                                    "assets/sounds/"+wordList[i]+".ogg"]));
        }

        for(let i = 0; i<secretWordList.length;i++){
            this.secretWords[i] = new Word(secretWordList[i]);
            this.secretWords[i].setImage(this.load.image(secretWordList[i]+"Image", "assets/images/"+secretWordList[i]+".jpg"));
            //this.word[i].setAudio(this.load.audio(this.shapes[i]+"Audio",["assets/sounds/"+this.shapes[i]+".mp3",
            //                                        "assets/sounds/"+this.shapes[i]+".ogg"]));
        }
        this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
        this.load.audio('explosionAudio','assets/sounds/explode.mp3');
        this.load.image('heartContainerImage','assets/images/heartContainer.png');
        this.load.audio('buzzerEffectAudio','assets/sounds/buzzerEffect.mp3');
       
    }

    create(){
        this.secretLetters = [];
        this.buttons = [];
        this.sounds = [];
        this.prompts = [];
        this.promptIndex = 0;
        this.isPlaying = false;
        this.secertWordSet = false;

        this.explosionAudio = this.sound.add('explosionAudio',{volume:0.1});
        this.buzzerEffectAudio = this.sound.add('buzzerEffectAudio',{volume:0.7});

        this.gameover = this.add.text(150,100,"GAME OVER",{
            fontFamily: 'Arial',
            fontSize: 80,
            color: "#fff200"
        });

        this.pointCounter = this.add.text(35,5,0,{
            fontFamily: 'Arial',
            fontSize: 64,
            color: "#fff200"
        });
        this.pointCounter.setVisible(false);

        this.gameover.setVisible(false);

        this.makeClock();
        this.makeStartButton();
        this.makePrompt();
        
        this.input.on('gameobjectdown', (pointer, gameObject) =>
        {
            if(this.isPlaying == false){
                return;
            }
            
            for(let i = 0; i<this.secretWords.length;i++){
                if(gameObject.name == this.secretWords[i].text){
                    if(gameObject.name == this.secertWord.text){
                        this.points+=100;
                        this.pointCounter.text = this.points;
                        this.reset();
                        this.startGame();
                        return;
                    }else{
                        this.buzzerEffectAudio.play();
                        this.playerHearts-=1;
                        this.heartContainers[this.playerHearts].setVisible(false);
                        if(this.playerHearts == 0){
                            this.isPlaying = false;
                            this.prompt.setVisible(false);
                            for(let i = 0;i<this.buttons.length;i++){
                                this.buttons[i].destroy();
                            }
                            for(let i = 0;i<this.secretLetters.length;i++){
                                this.secretLetters[i].setVisible(true);
                            }
                            for(let i = 0;i<this.secertWordChoices.length;i++)
                            {
                                if (this.secertWord.text != this.secertWordChoices[i].name){
                                    this.secertWordChoices[i].destroy();
                                }
                            }
                            this.gameover.setVisible(true);
                            this.startButton.y = 350;
                            this.startButton.setVisible(true);
                        }
                    }
                    return;
                }
            }
          
            if(gameObject.name == this.prompts[this.promptIndex].text){
                this.points+=10;
                this.pointCounter.text = this.points;
                emitter.x =gameObject.x;
                emitter.y =gameObject.y;
               for(let i = 0;i<this.buttons.length;i++){
                    if (gameObject.name==this.buttons[i].name){
                        this.secretLetters[i].setVisible(true);
                    }
                }
                gameObject.destroy();
                this.explosionAudio.play();
                emitter.explode(16);
                if(this.promptIndex<this.secertWord.text.length-1){
                    this.promptIndex+=1;
                    this.makeNewPrompt();
                }else{
                        this.prompt.setVisible(false);
                }
                
            
                
            }else{
                this.points-=1;
                if (this.points<0){
                    this.points = 0;
                }
                this.pointCounter.text = this.points;
            }
         
        });
       

        this.timedEvent = this.time.addEvent({ delay: 100, callback: this.onEvent, callbackScope: this,loop:true });
       
        const emitter = this.add.particles(400, 250, 'flares', {
            frame: [ 'red', 'yellow', 'green' ],
            lifespan: 4000,
            speed: { min: 150, max: 250 },
            scale: { start: 0.8, end: 0 },
            gravityY: 150,
            blendMode: 'ADD',
            emitting: false
        });
        this.heartContainers = [];
        for(let i = 0;i<3;i++){
            this.heartContainers[i] = this.add.image(50+i*50,85,"heartContainerImage");
            this.heartContainers[i].scale[2];
            this.heartContainers[i].setVisible(false);
        }

    }

    update(){
      
    }

    onEvent(){
        if(this.isPlaying){
            this.tenthsOfSecond -=1 ;
            if (this.tenthsOfSecond < 0){
                this.tenthsOfSecond = 9;
                this.seconds -= 1;
            }
            this.countDownClock.text = this.seconds + "." + this.tenthsOfSecond;
            //this.randomTints(this.buttons[Phaser.Math.Between(0,8)]);
        }
    }

    

    startGame(){
      
        for(let i = 0; i<this.secretLetters.length;i++){
            this.secretLetters[i].destroy();
        }
        
        this.gameover.setVisible(false);
        this.startButton.setVisible(false);
        this.countDownClock.setVisible(true);
        this.prompt.setVisible(true);
        this.tenthsOfSecond =0;
     
        this.isPlaying = true;
        this.makeSecretWord();
        this.secertWordChoices = [];
        for(let i = 0;i<this.secretWords.length;i++){
            this.secertWordChoices[i] = this.add.image(i*140+110,500,this.secretWords[i].text+"Image")
            this.secertWordChoices[i].name = this.secretWords[i].text;
            this.secertWordChoices[i].setInteractive();
        }
        this.secertWordChoices[0].scale =.3;
        this.secertWordChoices[1].scale =.2;
        this.secertWordChoices[2].scale =.1;
        this.secertWordChoices[3].scale =.1;
        this.secertWordChoices[4].scale =.2;
        
        
    }
    
    makeStartButton(){
            this.startButton = this.add.text(400, 300, 'Play Game', {
            fontFamily: 'Arial',
            fontSize: '32px',
            color: '#ffffff',
            align: 'center',
            fixedWidth: 260,
            backgroundColor: '#2d2d2d'
        }).setPadding(32).setOrigin(0.5);

        this.startButton.setInteractive({ useHandCursor: true });

        this.startButton.on('pointerover', () => {
            this.startButton.setBackgroundColor('#8d8d8d');
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setBackgroundColor('#2d2d2d');
        });

        this.startButton.on('pointerup',() => {
            this.playerHearts = 3;
            this.points = 0;
            this.pointCounter.text = this.points;
            this.pointCounter.setVisible(true);
            for(let i = 0;i<this.playerHearts;i++){
                this.heartContainers[i].setVisible(true);
            }
            this.seconds = 60;
            this.tenthsOfSecond = 0;
            this.startGame();
        });

    }
    makeClock(){
        this.countDownClock = this.add.text(640,5,60,{
            fontFamily: 'Arial',
            fontSize: 64,
            color: "#ffffff"
        })
        this.countDownClock.setVisible(false);
    }

    makePrompt(){
        
        this.prompt = this.add.text(400, 100, '?', {
            fontFamily: 'Arial',
            fontSize: '64px',
            color: '#05ffff',
            align: 'center',
            fixedWidth: 400
        }).setPadding(32).setOrigin(0.5);
        this.prompt.setVisible(false); 
    }

    makeNewPrompt(){
        console.log(this.prompts[0]);
        this.prompt.text = this.prompts[this.promptIndex].text;
        this.sounds[this.promptIndex].play();
    }

    randomTints(gameObject){
        gameObject.setTint(this.getRandomColor(), this.getRandomColor(), this.getRandomColor(), this.getRandomColor());
    }

    getRandomColor(){
        let r = Phaser.Math.Between(0,255);
        let g = Phaser.Math.Between(0,255);
        let b = Phaser.Math.Between(0,255);
        return Phaser.Display.Color.GetColor(r,g,b);
    }

    makeSecretWord(){
        this.secertWord = this.secretWords[Phaser.Math.Between(0,this.secretWords.length-1)];
        let wordList = [];
        for(let i = 0;i<this.words.length;i++){
            wordList[i] = i;
        }
        for(let i = 0;i<this.words.length;i++){
            let a = Phaser.Math.Between(0,wordList.length-1);
            while(a==i){
                a = Phaser.Math.Between(0,wordList.length-1);
            }
            let temp = wordList[i];
            wordList[i]=wordList[a];
            wordList[a] = temp;
        }

        let size = 80*this.secertWord.text.length;
        let start = 440-size/2;

        for(let i = 0;i<this.secertWord.text.length;i++){
            this.secretLetters[i] = this.add.text(start+80*i, 250, this.secertWord.text[i], {
                fontFamily: 'Arial',
                fontSize: '80px',
                color: '#ff11ff',
                align: 'center',
                fixedWidth: 400
            }).setPadding(32).setOrigin(0.5);
            this.secretLetters[i].setVisible(false);
            
            this.buttons[i] = this.add.image(i*100,0,this.words[wordList[i]].text+"Image");
            this.buttons[i].setName(this.words[wordList[i]].text);
            this.buttons[i].setInteractive();
            this.buttons[i].setScale(0.6,0.6);
            this.buttons[i].setPosition(start+80*i,250);
            this.randomTints(this.buttons[i]);
        }
     
        this.prompts = [];
        for(let i = 0;i<this.secertWord.text.length;i++){
            this.prompts[i] = this.words[wordList[i]];
        }

        
        for(let i = 0;i<this.prompts.length;i++){
            let a = Phaser.Math.Between(0,this.prompts.length-1);
            while(a==i){
                a = Phaser.Math.Between(0,this.prompts.length-1);
            }
            let temp = this.prompts[i];
            this.prompts[i]=this.prompts[a];
            this.prompts[a] = temp;
        }
        
        this.promptIndex = 0;

        for(let i = 0;i<this.prompts.length;i++){
            this.sounds[i] = this.sound.add(this.prompts[i].text+"Audio");  
        }
        this.makeNewPrompt();
    }

    reset(){
        this.prompt.setVisible(false);
        for(let i = 0;i<this.secretLetters.length;i++){
            this.secretLetters[i].destroy();
        }
        for(let i = 0;i<this.buttons.length;i++){
            this.buttons[i].destroy();
        }
        for(let i = 0; i<this.secertWordChoices; i++){
            this.secretWordChoices[i].destroy();
        }
    }

}

