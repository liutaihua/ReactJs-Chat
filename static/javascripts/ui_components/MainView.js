var MainView = React.createClass({

  getInitialState: function() {

    var messages = ['Hi there! 😘', 'Welcome to your chat app', 'See the tutorial at http://blog.pusher.com/react-chat'];
    messages = messages.map(function(msg){
      return {
        name: '系统',
        time: new Date(),
        text: msg
      }
    });

    return {
      messages: messages
    };
  },

  componentWillMount: function() {

    // this.pusher = new Pusher(PUSHER_CHAT_APP_KEY);
    // this.chatRoom = this.pusher.subscribe('messages');
    this.conn = this._connect();
  },

  onMessage: function(message) {
      this.setState({messages: this.state.messages.concat(message)});
      $("#message-list").scrollTop($("#message-list")[0].scrollHeight);
  },

  componentDidMount: function() {

    // this.chatRoom.bind('new_message', function(message){
    //   this.setState({messages: this.state.messages.concat(message)})
    //
    //   $("#message-list").scrollTop($("#message-list")[0].scrollHeight);
    //
    // }, this);

    $(document).ready(function(){
      $('#msg-input').emojiPicker({
        height: '150px',
        width: '200px',
        button: false
      });

    });
  },

  _connect: function _connect() {
      var heartbeatInterval = 10;
      var delay = 10;
      var max = 10;
      console.log("call connect")
      var ws = new WebSocket('ws://localhost:8090/sub?room_id=1&token=abc&batch=1');
      var auth = false;
    //   var _messageRecieve = this._messageRecieve;
      var onMessage = this.onMessage;

      ws.onopen = function() {
          getAuth();
      }

      ws.onmessage = function(evt) {
          var data = JSON.parse(evt.data);
          if (data) {
              auth = true;
              //heartbeat();
              //heartbeatInterval = setInterval(heartbeat, 4 * 60 * 1000);
          }
          if (!auth) {
              setTimeout(getAuth, delay);
          }
          if (auth) {
            var msg;
            //var empty = true;
            //for (var p in data[0]) {
            //    empty = false;
            //}
            //if (!empty){
            //    msg = data[0];
            //} else {
            //    msg = {name: "系统", text: "消息获取失败时的默认体"};
            //}

            data.forEach(function(m) {
                var msg = m;
                var message = {
                    name: msg.name,
                    time: msg.time,
                    text: msg.text
                };
                // _messageRecieve(message);
                onMessage(message);
            });
          }
      }

      ws.onclose = function() {
          if (heartbeatInterval) clearInterval(heartbeatInterval);
          setTimeout(reConnect, delay);
      }

      function heartbeat() {
          ws.send(JSON.stringify({
              'ver': 1,
              'op': 2,
              'seq': 2,
              'body': {}
          }));
      }
      //var user_count=0;
      //$.ajax({
      //    url: "http://localhost:7172/1/count",
      //    dataType: 'json',
      //    type: 'GET',
      //    //data: JSON.stringify({"user": "tester", "text": message}),
      //    success: function(data) {
      //        console.log("put likes count success", data)
      //        user_count = new Number(data.ret);
      //        console.log("put likes count success", data, user_count)
      //    }.bind(this),
      //    error: function (xhr, status, err) {
      //        console.error("error ajax", err.toString());
      //    }.bind(this)
      //});
      //var randomnumber = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

      function getAuth() {
          //ws.send(JSON.stringify({
          //    'ver': 1,
          //    'op': 7,
          //    'seq': 1,
          //    'body': {"uid": user_count + randomnumber, "rid":2000}
          //}));
      }
      function reConnect() {
          _connect(--max, delay * 2);
      }
      return this;
  },

  _messageRecieve: function(m) {
      var messages = this.state.messages;
    //   m.forEach(function(message) {
    //       console.log("_messageRecieve message", message)
    //       messages.push(message);
    //   })
      messages.push(m)
      console.log("receive msg:", m);
      this.setState({ messages: messages });
  },

  sendMessage: function(text){
    var message = {
      name: this.props.name,
      text: text,
      time: new Date()
    }
    var v = document.getElementById('msg-input').value;
    var j = {user: "test", text: v};
    console.log("send msg:", message);
    $.ajax({
        url: "http://localhost:7172/1/push/room?rid=1",
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(message),
        success: function(data) {
            console.log("put likes count success")
        }.bind(this),
        error: function (xhr, status, err) {
            console.error("error ajax", err.toString());
        }.bind(this)
    });
    var input = document.getElementById('msg-input');
    input.value = ""
  },

  _onClick: function(e){
    var input = document.getElementById('msg-input');
    var text = input.value;
    if (text === "") return;
    this.sendMessage(text);
  },

  _onEnter: function(e){
    if (e.nativeEvent.keyCode != 13) return;
    e.preventDefault();
    var input = e.target;
    var text = input.value;

    if (text === "") return;
    this.sendMessage(text);
  },

  toggleEmoji: function(evt){
      $('#msg-input').emojiPicker('toggle');
  },

  render: function() {

    if (!this.props.name) var style = {display:'none'}


    var body = (
      <div className="light-grey-blue-background chat-app">
        <Messages messages={this.state.messages}  />

        <div className="action-bar">
          <div className="option col-xs-1 white-background">
            <span id="emoji" onClick={this.toggleEmoji} className="fa fa-smile-o light-grey"></span>
          </div>
          <textarea id="msg-input" className="input-message col-xs-10" placeholder="Your message" onKeyPress={this._onEnter}></textarea>
          <div className="option col-xs-1 green-background send-message" onClick={this._onClick}>
            <span className="white light fa fa-paper-plane-o"></span>
          </div>
        </div>
      </div>
    );

    return (
      <div style={style} className="text-center">
        <div className="marvel-device iphone6 silver">
            <div className="top-bar"></div>
            <div className="sleep"></div>
            <div className="volume"></div>
            <div className="camera"></div>
            <div className="sensor"></div>
            <div className="speaker"></div>
            <div className="screen">
                {body}
            </div>
            <div className="home"></div>
            <div className="bottom-bar"></div>
        </div>
      </div>

    );
  }

});
