var nickname="";
  const socket = io();


  $('#nickbutton').click(()=>{
      socket.emit('nickname', $('#nickname').val());
      nickname= $("#nickname").val();
  });

  $('#sendbutton').click(()=>{
    socket.emit('chat message', $('#messagebox').val());
    $('#messagebox').val('');
  });
  socket.on('chat message', function(message){
    var classname="others";
    if(message['nick']==nickname){classname="me";}
    $('#messages').prepend($('<li class="'+classname +'">').text(message['nick'] +": "+message['msg']));
  });
  socket.on('disconnection',(data)=>{
    $('#messages').append($('<li>').text(data +" disconnected at "+Date()));
  });
  socket.on('NrOfUsrs',(data)=>{
    $("#users").html(data+ " connected user(s)");
  })
