import React from 'react';
import Map from '../map/map';
import ScheduleContainer from '../schedule/schedule_container';

class Address extends React.Component {
  constructor(props){
    super(props);
    this.addresses = [];
    this.fetchedAddresses = [];
    this.setChromeCount = 0;
    this.state = {
      showSchedules: false,
      showSchedulesLink: true,
      showAddressInput: false,
      showAddressInputLink: true,
      showMap: false,
      mapCoords: [37.7749, -122.4194],
      inputAddress: ""
    };

    this.showAddressInput = this.showAddressInput.bind(this);
    this.showSchedules = this.showSchedules.bind(this);
    this.submitAddress = this.submitAddress.bind(this);
    this.removeAddress = this.removeAddress.bind(this);
    this.setupChromeSync = this.setupChromeSync.bind(this);
    this.setAddresses = this.setAddresses.bind(this);
    this.closeMap = this.closeMap.bind(this);
    this.closeInputLink = this.closeInputLink.bind(this);
  }

//Lifecycle-------------------------------------------------------------

  componentDidMount(){
    this.props.getChromeSync();
  }

  componentDidUpdate(){
    this.setupChromeSync();
    this.setAddresses();
    let addresses = this.props.addresses;
    if(addresses !== undefined &&
       addresses.length !== 0 &&
       this.fetchedAddresses.indexOf(addresses) === -1){
      let addressString = addresses[0].split(" ").join("+");
      this.fetchedAddresses.push(addresses);
      this.props.requestGeocoder(addressString);
    }
  }

  setupChromeSync(){
    if(this.props.addresses === undefined && this.setChromeCount === 0){
      this.setChromeCount += 1;
      this.props.setChromeSync([]);
    }
  }

//Chrome----------------------------------------------------------------

  setAddresses(){
    this.addresses = this.props.addresses;
  }

  submitAddress(e){
    e.preventDefault();
    this.addresses.push(this.state.inputAddress);
    this.props.setChromeSync(this.addresses);
    this.setState({showAddressInput: false,
                   showAddressInputLink: true,
                   inputAddress: ""});
  }

  removeAddress(address, e){
    e.preventDefault();
    let idx = this.addresses.indexOf(address);
    this.addresses.splice(idx, 1);
    this.props.setChromeSync(this.addresses);
    this.setState({showSchedules: false,
                   showSchedulesLink: true,
                   showMap: false });
    let i = this.fetchedAddresses.indexOf(address);
    this.fetchedAddresses.splice(i, 1);
  }

//Address---------------------------------------------------------------

  showAddressInput(){
    this.setState({ showAddressInput: true,
                    showAddressInputLink: false });
  }

  addressesInputLink(){
    if(this.state.showAddressInputLink === true){
      return (
        <div className='address-input-link'
             onClick={this.showAddressInput}>
          Add Address
        </div>
      );
    }
  }

  closeInputLink(){
    this.setState({ showAddressInput: false,
                    showAddressInputLink: true });
  }

  addressInput(){
    if(this.state.showAddressInput === true){
      return (
        <form onSubmit={this.submitAddress}>
          <input type='text'
                 placeholder='Input address here'
                 value={this.state.inputAddress}
                 onChange={this.update('inputAddress')}
                 className='address-input-box-input'/>
          <input type='submit' value=""/>

          <div className='address-input-buttons'>
            <div className='address-input-box-submit'
              onClick={this.submitAddress}>
              <img src='../../../assets/icons/plus-icon.png'
                width='10'
                height='10'/>
            </div>

            <div className='address-input-box-submit'
              onClick={this.closeInputLink}>
              <img src='../../../assets/icons/icon-close-map.png'
                width='10'
                height='10'/>
            </div>
          </div>
        </form>
      );
    }
  }

  renderAddresses(addresses){
    if(addresses.length === 0 || addresses.length === undefined){
      return (
        <div>No addresses found!</div>
      );
    } else {
      let addressArr = addresses.map((address, i)=>{
        return(
          <div className='address-list-container' key={`address${i}`}>
            <div className='list-container'>
              <li type='circle' >
                {address}
              </li>
            </div>

            <div className='address-list-container-right-side'>
              <div className='close-icon-container'>
                <img src='../../../assets/icons/close-icon.png'
                  onClick={(e)=>this.removeAddress(address, e)}
                  height='17'
                  width='17'/>
              </div>

              <div className='map-icon-container'>
                <img src='../../../assets/icons/map-icon.png'
                  onClick={(e)=>this.toggleMap(address, e)}
                  height='17'
                  width='17'/>
              </div>
            </div>
          </div>
        );
      });

      return(
        <ul>{addressArr}</ul>
      );
    }
  }

//Schedules-------------------------------------------------------------

  schedules(){
    if(this.state.showSchedules === true){
      return(
        <div className='schedules-list'>
          <ScheduleContainer addresses={this.addresses}/>
        </div>
      );
    }
  }

  showSchedules(){
    this.setState({ showSchedulesLink: false,
                    showSchedules: true });
  }

  schedulesLink(){
    if(this.state.showSchedulesLink === true &&
       this.props.addresses.length !== 0){
      return(
        <div onClick={this.showSchedules} className='schedules-get'>
          <div>
            Get schedules!
          </div>
        </div>
      );
    }
  }

//Map-------------------------------------------------------------------

  toggleMap(address, e){
    e.preventDefault();
    window.console.log(this.props);
    this.setState({mapCoords: this.props.geocoders,
                   showMap: true});
  }

  showMap(){
    if(this.state.showMap === true){
      return (
        <Map position={this.state.mapCoords} />
      );
    }
  }

  closeMap(){
    this.setState({showMap: false});
  }

  showClose(){
    if(this.state.showMap === true){
      return(
        <span onClick={this.closeMap}>
          <img src='../../../assets/icons/icon-close-map.png'
               height='11'
               width='11'/>
        </span>
      );
    }
  }

//MISC------------------------------------------------------------------

  update(field){
    return e => { this.setState({[field]: e.currentTarget.value }); };
  }

  render(){
    if(this.props.addresses === undefined){
      return (
        <div className='loader'></div>
      );
    } else {
      return (
        <div>
          <div>
            <div className='address-list'>
              {this.renderAddresses(this.props.addresses)}
            </div>
              {this.schedulesLink()}
              {this.schedules()}
              {this.addressesInputLink()}

            <div className='address-input-box'>
              {this.addressInput()}
            </div>
          </div>

          <div className='address-map'>
            {this.showClose()}
            {this.showMap()}
          </div>
        </div>
      );
    }
  }
}

export default Address;
