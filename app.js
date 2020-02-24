const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true })); 


const pool = mysql.createPool({
    host: 'remotemysql.com',
    user : 'YmXJZhIq7a',
    password : '3FEUqbSX8j',
    database : 'YmXJZhIq7a',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


app.post('/', function(req, res) {
    let noteText = req.body.noteText;
    if( !noteText.replace(/\s/g, '').length || !noteText){
        console.log('Empty note');
    }else{
        let noteDate = formattedDate();
        insertNote(noteDate,noteText);
    }
    res.redirect(req.get('referer'));
});

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res) {

    let html = getPageHtml().then(function(result){
        res
        .status(200)
        .send(result);
    });

});

async function getPageHtml(){
    return await pool.query('SELECT * FROM notes').then(function(oldNotes){

        let html = '<html>'+
        '<meta charset="UTF-8">'+
        '<head>'+
            '<link rel="stylesheet" href="css/styles.css">'+
        ' <link rel="icon" href="favicon.ico">'+
        '</head>'+
        
        '<body onload ="addAutoResize()">'+
            '<form method="post" action="/">'+
            ' <div class="notediv">'+
                ' <textarea name="noteText" class="notetextarea" data-autoresize placeholder = "Input note here..."></textarea>'+
                ' <input type="submit" class="notebutton" value ="              Note that!             ">'+
            '</div>'+
            '</form>'+
            '<div style = "position: absolute; right: 16%; width: 26%; top: 9%;">';

        html += writeNotes(oldNotes[0]);
        html +='</div></body>'+
        
        '<script  type="text/javascript" src="js/stars.js"></script>'+
        '<script  type="text/javascript" src="js/textAreaResize.js"></script>'+
        '</html>';

        return html;
    });
   
}

function writeNotes(oldNotes){
    
    let writeNotesResponse = "";
    oldNotes.reverse().forEach(function(note){ 
        writeNotesResponse += '<div>';
        writeNotesResponse += '<label style="padding-left: 1.5em; float: right; margin: 2px; color: #2DF02D; background-color: rgba(113,113,113,0.5);">' + note.noteDate +'</label>';
        writeNotesResponse += '<textarea class="oldNotes" data-autoresize readonly>' + note.noteText + '</textarea>';
        writeNotesResponse += '</div>';
        
    }); 

    return writeNotesResponse;
}

function formattedDate(){
    let date = new Date();
    let day =  date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();
    let month = (date.getMonth()+1) < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1;
    let year = date.getFullYear();

    let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    let seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    return hour + ':' + minutes + ':' + seconds + ' ' +day + '/' + month + '/' + year ;
}

async function insertNote(noteDate,noteText){
        let sql = "INSERT INTO notes (noteDate, noteText) VALUES ('" + noteDate + " ', ' " + noteText + " ')";
        await pool.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
}


app.listen(3000);
