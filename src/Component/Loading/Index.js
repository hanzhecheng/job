import ContentLoader from 'react-content-loader'
import React, { Component } from 'react'
import './Loading.css'
class Loading extends Component {
    render() {
        return (
            <ContentLoader className="loading" height={200} secondaryColor="Gainsboro">
                <rect x="110" y="15" rx="5" ry="5" width="130" height="18" />
                <rect x="10" y="35" rx="5" ry="5" width="155" height="145" />
                <rect x="170" y="35" rx="5" ry="5" width="193" height="145" />
            </ContentLoader>
        )
    }
}
export default Loading