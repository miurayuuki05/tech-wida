'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import styles from '../style/style.module.css';

export default function Graphinvoice() {
    const [invoices, setInvoices] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filter, setFilter] = useState('daily');

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get('http://localhost:3005/api/invoice');
                setInvoices(response.data.invoices);
                setFilteredData(response.data.invoices);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    useEffect(() => {
        const filterInvoices = () => {
            const today = new Date();
            let filtered = [];

            if (filter === 'daily') {
                filtered = invoices.filter(invoice =>
                    new Date(invoice.createdAt).toISOString().split('T')[0] === today.toISOString().split('T')[0]
                );
            } else if (filter === 'weekly') {
                const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                filtered = invoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.createdAt);
                    return invoiceDate >= startOfWeek && invoiceDate <= new Date();
                });
            } else if (filter === 'monthly') {
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                filtered = invoices.filter(invoice => new Date(invoice.createdAt) >= startOfMonth);
            }

            setFilteredData(filtered);
            drawChart(filtered);
        };

        filterInvoices();
    }, [filter, invoices]);

    const drawChart = (data) => {
        d3.select('#chart').selectAll('*').remove();

        if (data.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 40, left: 40 },
              width = 800 - margin.left - margin.right,
              height = 400 - margin.top - margin.bottom;

        const svg = d3.select('#chart')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const dataFormatted = d3.rollup(
            data,
            v => d3.sum(v, d => parseFloat(d.total_amount)),
            d => new Date(d.createdAt).toLocaleDateString()
        );

        const dataArray = Array.from(dataFormatted, ([date, total_amount]) => ({ date, total_amount }));

        const x = d3.scaleBand()
            .domain(dataArray.map(d => d.date))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(dataArray, d => d.total_amount)]).nice()
            .range([height, 0]);

        svg.append('g')
            .selectAll('.bar')
            .data(dataArray)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.date))
            .attr('y', d => y(d.total_amount))
            .attr('width', x.bandwidth())
            .attr('height', d => height - y(d.total_amount))
            .attr('fill', 'steelblue');

        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d => d.split('/').reverse().join('/')));

        svg.append('g')
            .call(d3.axisLeft(y));
    };

    return (
        <div className={styles.graphcontainer}>
            <div className='mb-10'>
              <h1 className='text-3xl font-bold'>Invoice Chart</h1>
            </div>
            <button onClick={() => setFilter('daily')}>Daily</button>
            <button onClick={() => setFilter('weekly')}>Weekly</button>
            <button onClick={() => setFilter('monthly')}>Monthly</button>
            <div id="chart"></div>
        </div>
    );
};
