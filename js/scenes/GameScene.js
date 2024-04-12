class GameScene extends Phaser.Scene{
    

    constructor(){
        super ({key:"gameScene"});

    }

    preload(){
        this.shapes = ["circle","dot","heart","line","oval","rectangle","square","star","triangle"]
        //this.load.image("wrongImage","/assets/images/wrong.png");
        for(let i = 0; i<this.shapes.length;i++){
            this.load.image(this.shapes[i]+"Image", "../assets/images/"+this.shapes[i]+".png");
            this.load.audio(this.shapes[i]+"Audio","../assets/sounds/"+this.shapes[i]+".mp3");
        }
        
    }

    create(){
        this.sounds = [];
        for(let i = 0; i<this.shapes.length;i++){
             this.sounds[i] = this.sound.add(this.shapes[i]+"Audio");

        }
        
        this.makeClock();
        this.makeStartButton();
        this.makeButtons();
        this.makePrompt();
        
        
        this.input.on('gameobjectdown', (pointer, gameObject) =>
        {
            
            if(gameObject.name == this.shapes[this.answer]){
                this.makeNewPrompt();
            }
            
            

        });
       
        this.timedEvent = this.time.addEvent({ delay: 100, callback: this.onEvent, callbackScope: this,loop:true });
       
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
        }
    }

    

    startGame(){
        this.startButton.setVisible(false);
        this.countDownClock.setVisible(true);
        this.prompt.setVisible(true);
        this.tenthsOfSecond =0;
        this.seconds = 60;
        this.isPlaying = true;

        for(let i = 0; i<this.shapes.length;i++){
            this.buttons[i].setVisible(true);
        }
        
        this.makeNewPrompt();
        
    }
    
    makeButtons(){
        this.buttons = [];
        for(let i = 0; i<this.shapes.length;i++){
            this.buttons[i] = this.add.image(i*100,0,this.shapes[i]+"Image");
            this.buttons[i].setName(this.shapes[i]);
            this.buttons[i].setInteractive();
            this.buttons[i].setScale(0.5,0.5);
            this.buttons[i].setPosition(i*64+150,300);
            this.buttons[i].setVisible(false);
        }
   
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
        this.answer = Math.floor(Math.random() * this.shapes.length);
        this.prompt.text = this.shapes[this.answer];
        this.sounds[this.answer].play();
    }
}