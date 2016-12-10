 var canvas = document.getElementById('canvas');
 var zombi = canvas.getContext('2d');

 zombi.fillStyle = 'darkgreen';

 var y=0;
 setInterval(function(){
  y+=2;
  zombi.clearRect(0, 0, canvas.width, canvas.height);
     zombi.fillRect(0,y,100,100);
 }, 16);