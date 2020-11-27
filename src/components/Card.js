import { Link } from 'gatsby';
import React from 'react';

export default function Card({ url, title }) {
    return <div className="card">
        <table style={{ width: '100%' }}>
            <tbody>
                
                <tr>

                    <th>Title</th>
                    <th>URL</th>
                </tr>

                <td><h4>{title}</h4></td>
                <td><Link to={url} className="url"><b>{url}</b></Link></td>
            </tbody>
        </table>
    </div>
}