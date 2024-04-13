class GameScene extends Phaser.Scene{
    

    constructor(){
        super ({key:"gameScene"});

    }

    preload(){
        let wordList = ["circle","dot","heart","line","oval","rectangle","square","star","triangle"]
        let secretWordList = ["Drum","Rabbit"];
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
            //this.word[i].setImage(this.load.image(this.shapes[i]+"Image", "assets/images/"+this.words[i]+".png"));
            //this.word[i].setAudio(this.load.audio(this.shapes[i]+"Audio",["assets/sounds/"+this.shapes[i]+".mp3",
            //                                        "assets/sounds/"+this.shapes[i]+".ogg"]));
        }
        this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
        this.load.audio('explosionAudio','assets/sounds/explode.mp3');
       
    }

    create(){
        this.secretLetters = [];
        this.buttons = [];
        this.sounds = [];
        this.prompts = [];
        this.promptIndex = 0;

        this.explosionAudio = this.sound.add('explosionAudio',{volume:0.1});

        this.makeClock();
        this.makeStartButton();
        this.makePrompt();
        
        this.input.on('gameobjectdown', (pointer, gameObject) =>
        {
            console.log(this.prompts[this.promptIndex].text);
            if(gameObject.name == this.prompts[this.promptIndex].text){
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
                this.promptIndex+=1;
                this.makeNewPrompt();
            } else{
                
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
        this.startButton.setVisible(false);
        this.countDownClock.setVisible(true);
        this.prompt.setVisible(true);
        this.tenthsOfSecond =0;
        this.seconds = 60;
        this.isPlaying = true;
        this.makeSecretWord();
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
            this.startGame();
        });

    }
    makeClock(){
        this.countDownClock = this.add.text(640,10,60,{
            fontFamily: 'Arial',
            fontSize: 64,
            color: "#00ff00"
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


}

