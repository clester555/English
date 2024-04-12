class LoginScene extends Phaser.Scene{
    
    constructor(){
        super ({key:"loginScene"});

    }

    create(){
        this.add.text(100,200,"Lalala",{
            fontFamily: 'Arial',
            fontSize: 64,
            color: "#00ff00"
        })
    }

    update(){
        
    }
}