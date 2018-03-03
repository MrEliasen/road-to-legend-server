import React from 'react';
import axios from 'axios';
import config from '../../config';

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import {Card, CardHeader, CardBody, Input, Button, FormGroup} from 'reactstrap';

class AuthRegister extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            strategies: null,
            email: '',
            password: '',
            passwordRepeat: '',
            status: null,
            sending: false,
        };

        this.register = this.register.bind(this);
    }

    componentWillMount() {
        this.fetchAuthStrategies();
    }

    fetchAuthStrategies() {
        axios.get(`${config.api.host}/api/auth`)
            .then((response) => {
                this.setState({
                    strategies: response.data.authlist,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    register() {
        const state = {...this.state};
        // clear the status message
        this.setState({
            status: {
                message: 'Creating Account',
                type: 'info',
            },
            sending: true,
        });

        axios
            .post(`${config.api.host}/api/account`, {
                email: state.email,
                password: state.password,
                method: 'local',
            })
            .then((response) => {
                this.setState({
                    sending: false,
                    status: {
                        message: response.data.message,
                        type: 'success',
                    },
                });
            })
            .catch((err) => {
                let errorMsg = 'Something went wrong. Please try again in a moment.';

                if (err.response) {
                    errorMsg = err.response.data.error || errorMsg;
                }

                this.setState({
                    sending: false,
                    status: {
                        message: errorMsg,
                        type: 'danger',
                    },
                });
            });
    }

    showStatus() {
        if (!this.state.status) {
            return null;
        }

        return <p className={`alert alert-${this.state.status.type}`}>
            {this.state.status.message}
        </p>;
    }

    render() {
        return (
            <Card className="card-small">
                <CardHeader>Welcome to the party!</CardHeader>
                {
                    this.state.strategies &&
                    <CardBody className="text-center">
                        {this.showStatus()}
                        {
                            // if local authentication strategy is enabled
                            this.state.strategies.find((auth) => auth.provider === 'local') &&
                            <React.Fragment>
                                <FormGroup>
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        autoComplete="email"
                                        disabled={this.state.sending}
                                        onChange={(e) => {
                                            this.setState({
                                                email: e.target.value,
                                            });
                                        }}
                                        value={this.state.email}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        autoComplete="new-password"
                                        disabled={this.state.sending}
                                        onChange={(e) => {
                                            this.setState({
                                                password: e.target.value,
                                            });
                                        }}
                                        value={this.state.password}
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <Input
                                        type="password"
                                        name="password_repeat"
                                        placeholder="Password repeat"
                                        autoComplete="new-password"
                                        disabled={this.state.sending}
                                        onChange={(e) => {
                                            this.setState({
                                                passwordRepeat: e.target.value,
                                            });
                                        }}
                                        value={this.state.passwordRepeat}
                                    />
                                </FormGroup>
                                <Button onClick={this.register} disabled={this.state.sending} color="primary">Create account</Button>
                                <hr />
                            </React.Fragment>
                        }
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia, laboriosam!</p>
                        {
                            this.state.strategies.map((strat) => {
                                if (strat.provider === 'local') {
                                    return null;
                                }

                                return <a key={strat.provider} className={`btn btn-block btn-primary btn-brand-${strat.provider}`} href={this.state.sending ? '#' : strat.authUrl}>
                                    <FontAwesomeIcon icon={['fab', strat.provider]} /> Sign up with {strat.name}
                                </a>;
                            })
                        }
                    </CardBody>
                }
            </Card>
        );
    }
};

export default AuthRegister;
