var WelcomeView = React.createClass({

  render: function() {

    var view;
    var name = this.props.name;

    if (name) {
      view = <h3 className="light white">Welcome <b>{name}</b></h3>
    } else {
      view = (
        <div style={{marginTop: '20px'}}>
          <p className="light white">Enter your name and start chatting!</p>
          <div style={{marginTop: '20px'}}>
            <input id="input-name" className="swish-input" style={{width: '350'}} onKeyPress={this.props._onName} placeholder="Enter Your Name here" />
            <button className="bright-blue-hover btn-white" onClick={this.props._onClick} id="try-it-out">
              Try it out
            </button>
          </div>
        </div>
      )
    }


    return (

      <section className="blue-gradient-background intro-splash splash">
          <div className="container center-all-container">
            <h1 className="white light splash-title" style={{fontSize: '36px'}}>
              Realtime Chat Simulator
            </h1>
            {view}
          </div>
      </section>
    )

  }

});
