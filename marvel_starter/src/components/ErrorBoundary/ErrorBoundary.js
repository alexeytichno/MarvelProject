import { Component } from "react";
import ErrorMessege from "../errorMessege/ErrorMessege";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMessege/>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;