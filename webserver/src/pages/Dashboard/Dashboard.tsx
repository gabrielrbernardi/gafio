import React from 'react';
import {Chart} from 'primereact/chart';

import './Dashboard.css';

const Dashboard = () => {
    const data = {
        labels: ['Ciprofloxacino','Sulfadiazina','Gentamicina', ' 	Teicoplanina'],
        datasets: [
            {
                data: [100, 50, 75, 25],
                backgroundColor: [
                    "#23ad48",
                    "#258bba",
                    "#ff9100",
                    "#00cfcf"
                ],
                hoverBackgroundColor: [
                    "#1c8a39",
                    "#195f80",
                    "#cf7500",
                    "#007373"
                ]
            }
        ]
    };
    const data1 = {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Azitromicina',
                backgroundColor: '#9CCC65',
                data: [65, 59, 80, 81, 56, 55, 40, 10]
            },
            {
                label: 'Amoxicilina',
                backgroundColor: '#42A5F5',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };
    const data2 = {
        labels: [
            "Médico",
            "Farmácia",
            "Enferamaria",
            "Pronto Socorro"
        ],
        datasets: [{
            data: [11, 16, 7, 12],
            backgroundColor: [
                "#FF6384",
                "#4BC0C0",
                "#FFCE56",
                "#36A2EB"
            ],
            label: 'My dataset'
        }],
    };

    return (
        <>
            <div className="row m-2">
                <div className="card shadow-lg p-3 col-sm-5 mx-auto border">
                    <p className="h5">Valores gerais</p>
                    <Chart type="pie" data={data} />
                </div>
                <div className="card shadow-lg p-3 col-sm-6 mx-auto border">
                    <p className="h5">Doses por mês</p>
                    <Chart type="bar" data={data1} />
                </div>
                <div className="card shadow-lg mt-3 p-3 col-sm-6 mx-auto border">
                    <p className="h5">Doses por departamento</p>
                    <Chart type="polarArea" data={data2} />
                </div>
            </div>
        </>
    )
}

export default Dashboard;