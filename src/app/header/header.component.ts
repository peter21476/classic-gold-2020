import { Component, OnInit } from '@angular/core';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';
import { faNewspaper } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  APPID: string = '7bd038c713a43503399fe8b1cf907575';

  faHome = faHome;
  faMicrophone = faMicrophone;
  faNewspaper = faNewspaper;
  faEnvelope = faEnvelope;

  getWeather: any;

  response:any;

  weatherIcon: string;

  countries:any;

  selectedCountry: string;

  selectedState: string;

  selectedTown: string;

  selectedMetric: string = 'imperial';

  usaStates: any;

  state:any;

  createUrl:any;

  expiredDate: any;

  showAlert: boolean = false;

  messageToBox: any;

  //check cookies ok page load
  getCookieCountry = this.cookie.get('country');
  getCookieState = this.cookie.get('state');
  getCookieTown = this.cookie.get('town');
  getCookieMetric = this.cookie.get('metric');

  constructor(private http: HttpClient, private cookie: CookieService) { }

  ngOnInit() {

    //validation of cookies for corresponded api url
    if(this.getCookieCountry === '') {
      this.createUrl = `http://api.openweathermap.org/data/2.5/weather?id=6167865&units=imperial&APPID=${this.APPID}`;
    }

    if(this.getCookieState === '' && this.getCookieCountry !=='' ) {
      this.createUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.getCookieTown},${this.getCookieCountry}&units=${this.getCookieMetric}&appid=${this.APPID}`;
    }

    if(this.getCookieState !== '' && this.getCookieCountry !=='') {
      this.createUrl = `http://api.openweathermap.org/data/2.5/weather?q=${this.getCookieTown},${this.getCookieState},${this.getCookieCountry}&units=${this.getCookieMetric}&appid=${this.APPID}`;
    }
    this.weatherCall();
  }

  //API CALL
  weatherCall(){
    this.showAlert = false;
    this.getWeather = this.http.get(this.createUrl);
    this.getWeather.subscribe((response) => {
     this.response = response;
     this.weatherIcon = 'http://openweathermap.org/img/w/' + this.response.weather[0].icon + '.png';
    }, (err) => {
      if (err.status = "404") {
        this.messageToBox = {message: 'Location Not Found, please check your input'};
        this.showAlert = true;
      }
    });
  }

  openModalWeather(){

    //clearing the form in the modal
    this.showAlert = false;
    this.selectedCountry = '';
    this.selectedState = '';
    this.selectedTown ='';

    //get list of countries
    let getCountries = this.http.get('https://restcountries.eu/rest/v2/all');
    getCountries.subscribe((countries) => {
      this.countries = countries;
    });

    //get list of states
    let getStates = this.http.get('../assets/json/usastates.json');
    getStates.subscribe((usaStates) => {
      this.usaStates = usaStates;
    });
  }

  //updating weather location
  getWeatherResults(){

    this.showAlert = false;

    let updatedCountry = this.selectedCountry;
    let updatedState = this.selectedState;
    let updatedTown = this.selectedTown;
    let updatedMetric = this.selectedMetric;
    let countryInvalid;
    let stateInvalid;
    let townInvalid;
    let metricInvalid;

    //VALIDATION OF FIELDS
    if(updatedCountry == null || updatedCountry == undefined || updatedCountry == '') {
      updatedCountry = undefined;
      countryInvalid = "*Please choose your country<br /><br />"
    } else {
      countryInvalid = '';
    }

    if(updatedState == null && this.selectedCountry == 'US' || updatedState == undefined && this.selectedCountry == 'US' || updatedState == '' && this.selectedCountry == 'US') {
      updatedState = undefined;
      stateInvalid = "*Please choose your state<br /><br />"
    } else {
      stateInvalid = '';
    }

    if(updatedTown == null || updatedTown == undefined || updatedTown == '') {
      updatedTown = undefined;
      townInvalid = "*Please choose your town/city<br /><br />"
    } else {
      townInvalid = '';
    }

    if(updatedMetric == null || updatedMetric == undefined) {
      updatedMetric = undefined;
      metricInvalid = "*Please choose your country<br /><br />"
    } else {
      metricInvalid = '';
    }

    let alertMessage = countryInvalid + stateInvalid + townInvalid + metricInvalid ;

    if(updatedCountry == undefined || updatedState == undefined && this.selectedCountry == 'US' || updatedTown == undefined || updatedMetric == undefined) {
      this.messageToBox = {message: alertMessage};
      this.showAlert = true;
    } else {
      if (updatedState == undefined) {
        this.createUrl = `http://api.openweathermap.org/data/2.5/weather?q=${updatedTown},${updatedCountry}&units=${updatedMetric}&appid=${this.APPID}`;
      } else {
        this.createUrl = `http://api.openweathermap.org/data/2.5/weather?q=${updatedTown},${updatedState},${updatedCountry}&units=${updatedMetric}&appid=${this.APPID}`;
      }
      this.weatherCall();
      this.showAlert = true;
      this.messageToBox = {message: '<div class="location-updated"><p>Location Updated!</p></div>'};
      
      //Cookies set up
      this.expiredDate = new Date();
      this.expiredDate.setDate( this.expiredDate.getDate() + 7 );
      this.cookie.set('country', updatedCountry, this.expiredDate);
      this.cookie.set('state', updatedState, this.expiredDate);
      this.cookie.set('town', updatedTown, this.expiredDate);
      this.cookie.set('metric', updatedMetric, this.expiredDate);
    }

  }

}
