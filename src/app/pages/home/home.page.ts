import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

import { WeatherProvider } from '../../providers/weather';
import { NavParamsService } from '../../providers/navParamsService';
import { CacheService } from "ionic-cache";
@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {
    private cityList: Array<any>=[];
    private query: string;
    private key = 'latest-searched-city';
    private cachedCity:any;
    private cachedCityList:any=[];
    public loadProgress : number = 0;
    private isLoading:boolean =false;
    constructor(
        private weatherApi: WeatherProvider,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private navParamsSrv: NavParamsService,
        private cache: CacheService
    ) {
        this.query = '';
        this.loadCachedData();
    }

    loadCachedData(){
        this.getCachedcities();
        console.log(this.cachedCityList)
        
    }
    search(event) {
       // console.log(event);
        this.query = event.detail.value;
        this.cityList = this.weatherApi.search(this.query);
    }
    goToDetails(city){
        this.presentLoading();
        //this.cachedCity=this.cache.getOrSetItem(this.key, city);
         this.cache.saveItem(this.key, city).then((val)=>{
            console.log(JSON.parse( val.value));
            this.cachedCityList.unshift(val.value);


            this.cache.saveItem("cachedCityList",this.cachedCityList).then((data)=>{
                console.log(JSON.parse( data.value));
             })

         });

        
        
        this.weatherApi.query('forecast', {id: city.id, units: 'metric'})
        .subscribe(async cityDetails => {
            this.navParamsSrv.set('detail', cityDetails);
          //  await this.loadingCtrl.dismiss();
          this.presentLoading();
            await this.navCtrl.goForward('/detail')
        })
    }


    getCachedcities(){
        if(this.cache.itemExists("cachedCityList")){
            console.log( this.cache.getItem("cachedCityList"))

            this.cache.getItem("cachedCityList").then((data) => {
                console.log( JSON.parse(data));
               this.cachedCityList.unshift(JSON.parse(data));
               this.cityList=[];
               this.cityList=this.cachedCityList;
               // this.loadCityList();
        
               // this.concat();
              });
            }
         //   let data = await this.cache.getItem(this.key)
         //  let dat=  JSON.parse(data.value);
          //   console.log( data)
          //  this.cityList.push(data)
          
        }
       loadCityList(){
           this.cityList.concat(this.cachedCityList);
                console.log(this.cityList)
            } 
                   
        
    async presentLoading() {
this.isLoading=!this.isLoading;
        setInterval(() => {
            if (this.loadProgress < 100)
              this.loadProgress += 1;
            else
              clearInterval(this.loadProgress);
          }, 15);
    /*     const loading = await this.loadingCtrl.create({
            content: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        return await loading.present(); */
    }
}
