import React, { Component } from "react";
import Logo from "./assets/img/logo.png";
import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import SearchIcon from '@material-ui/icons/Search';
import AppCss from "./assets/css/app.css";
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import Axios from "axios";
import ErrorIcon from '@material-ui/icons/Error';


class App extends Component {
    constructor(prop) {
        super(prop);
        this.switchSidebar = this.switchSidebar.bind(this);
        this.loadMore = this.loadMore.bind(this);
    }

    componentWillMount() {
        let self = this;
        this.setState((state,props)=>{
            return {
                isLoading:true
            }
        });
        Axios.get("https://newsapi.org/v2/top-headlines?country=us&page="+self.state.currentPage+"&apiKey=f5c8566a484a41a3a377bbbec1e0a800")
             .then((data)=>{
                 self.setState((state,props)=>{
                     return {
                         datas:state.datas.concat(data.data.articles),
                         p:Math.ceil(data.data.totalResults/20),
                         error:false,
                         isLoading:false
                     }
                 });
             })
             .catch((err)=>{
                self.setState((state,props)=>{
                    return {
                        error:true,
                        datas:[],
                        currentPage:1,
                        page:0,
                        isLoading:false
                    }
                });
             });
    }

    state = {
        showSidebar:false,
        categories:[
            "Nairaland/General","Politics","Crime","Romance","Jobs/Vacancy","Career","Business",
            "Entertainment","TV/Movies","Music/Radio","Celebrities","Fashion","Science/Technology",
            "Programming","Webmasters","Computers","phones","Religion","Food","Diaries"
        ],
        datas:[],
        p:1,
        currentPage:1,
        isLoading:false,
        minorLoad:false,
        error:false,
    }

    loadMore = function() {
        let self = this;
        this.setState((state,props)=>{
            return {
                minorLoad:true
            }
        });
        Axios.get("https://newsapi.org/v2/top-headlines?country=us&page="+(self.state.currentPage + 1) +"&apiKey=f5c8566a484a41a3a377bbbec1e0a800")
             .then((data)=>{
                 self.setState((state,props)=>{
                     return {
                         datas:state.datas.concat(data.data.articles),
                         p:Math.ceil(data.data.totalResults/20),
                         currentPage: state.currentPage + 1,
                         minorLoad:false,
                         error:false
                     }
                 });
             })
             .catch((err)=>{
                self.setState((state,props)=>{
                    return {
                        error:true,
                        datas:[],
                        currentPage:1,
                        page:0,
                        minorLoad:false
                    }
                });
             });
    }

    switchSidebar = function() {
        return this.setState((state,props)=>{
            return {
                showSidebar:!state.showSidebar
            }
        });
    }

    splitDescription = function(data) {
        var splited = data.split("\n");
        splited = splited.slice(0,4);
        return splited.join("\n");
    }

    formatDate = function(data){
        var date = new Date(data);
        var result = "";
        result += date.getDate() > 9 ? date.getDate()+"-" : "0"+date.getDate()+"-";
        result += (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) + "-" : "0" + (date.getMonth() + 1) + "-";
        result += date.getFullYear();
        return result;
    } 

    loadButton = function(){
        console.log()
        if(this.state.minorLoad && this.state.datas.length > 0 && this.state.currentPage < this.state.p) {
            return <button>Loading....</button>;
        }else if(this.state.datas.length > 0 && this.state.currentPage < this.state.p){
            return <button onClick={this.loadMore}>Load more</button>
        }else{
            return null;
        }
    }

    render(){
        return (
            <div id="container">
                <header>
                    <nav>
                        <div id="menu-div">
                            <div>
                            <MenuIcon onClick={this.switchSidebar} style={this.state.showSidebar == true ? {"display":"none"} : {}} id="menu-icon"/>
                            <ClearIcon onClick={this.switchSidebar} style={this.state.showSidebar == false ? {"display":"none"} : {}} id="clear-icon"/>
                            </div>
                            <img id="header-img" src={Logo} />
                        </div>
                        <div id="search-div">
                            <input type="text" id="search-bar" placeholder="Search"/>
                            <button id="search-button"><SearchIcon id="search-icon"/></button>
                            <button id="join">Join Nairaland</button>
                            <ul>
                                <li>Log in</li>
                            </ul>
                        </div>
                    </nav>
                </header>
                <div id="sidebar" style={this.state.showSidebar == false ? {"display":"none"} : {}}>
                    <div id="first">
                        <ul>
                            <li>Categories <ArrowRightIcon id="right-arrow"/></li>
                            <li>Log in</li>
                            <li>Join Nairaland</li>
                        </ul>
                    </div>
                    <div id="second">
                        <ul>
                        {this.state.categories.map((category)=>{
                        return (
                            <li key={category}>{category}</li>
                        );
                    })}
                        </ul>
                    </div>
                </div>
                <div id="cat-div" style={this.state.showSidebar == true ? {"display":"none"} : {}}>
                    {this.state.categories.map((category)=>{
                        return (
                            <button key={category} className="cat-btn">{category}</button>
                        );
                    })}
                </div>
                <div id="loader" style={this.state.showSidebar == true || !this.state.isLoading ? {'display':"none"} : {}}>
                    Loading........
                </div>
                <div id="error" style={this.state.showSidebar == true || !this.state.error ? {'display':"none"} : {}}>
                    <ErrorIcon/> Oooops.....
                </div>
                <div id="article-div" style={this.state.showSidebar == true || this.state.datas.length == 0 ? {'display':"none"} : {}}>
                    {this.state.datas.map((data)=>{
                        return (
                            <div key={data.id} className="article">
                                <div className="article-header">
                                    <h5><a href={data.url} target="_blank">{data.title}</a></h5>
                                    <div className="date-posted">
                                        {this.formatDate(data.publishedAt)}
                                    </div>
                                </div>
                                <p>{this.splitDescription(data.description)}</p>
                            </div>
                        );
                    })}
                </div>
                <div id="load-more-div" style={this.state.showSidebar == true || this.state.datas.length == 0 ? {'display':"none"} : {}}>
                    {this.loadButton()}
                </div>
                <footer style={this.state.showSidebar == true ? {'display':"none"} : {}} >
                    Designed by Ubah E.
                </footer>
            </div>
        );
    }
}

export default App;