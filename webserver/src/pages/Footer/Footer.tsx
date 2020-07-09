import React from 'react';
import {RiCopyrightLine} from 'react-icons/ri';
import {IoLogoGithub} from 'react-icons/io';

import '../../App.css';

const Footer = () => {
    return (
        <footer className="card col-sm-11 mx-auto mt-5 text-center text-light text-decoration-none header-background border-0">
            <div className="row mx-auto">
                <p className="h5 mt-1"><RiCopyrightLine size={20}/> GAFio Devs, 2020</p>
                <a className="h5 mt-1 ml-3 text-light" href="https://github.com/Sinhoroto/gafio" target="_blank"><IoLogoGithub size={25}/></a>
            </div>
        </footer>
    )
}

export default Footer;