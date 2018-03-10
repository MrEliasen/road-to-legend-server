import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {newEvent} from '../events/actions';
import {Card, CardBody, CardHeader} from 'reactstrap';
import classnames from 'classnames';
import {getStringColour} from '../../../helper';

class PlayerMap extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sidebar: 'players',
            command: '',
        };

        this.showStructureInfo = this.showStructureInfo.bind(this);
    }

    showStructureInfo(structure) {
        this.props.newEvent({
            type: 'structure-info',
            structure: structure,
        });
    }

    renderMinimap() {
        const gridX = 30;
        const gridY = 30;
        let grid = [];
        let buildings = {};

        // Let's cache the buildings array here to avoid affecting performance inside the nested loop
        let map = this.props.maps[this.props.character.location.map];
        map.buildings.map((building) => {
            buildings[building.location.x + '-' + building.location.y] = building.colour;
        });

        for (let y = 0; y < gridY; y++) {
            let cells = [];
            for (let x = 0; x < gridX; x++) {
                let cellId = x + '-' + y;
                let classes = ['x'];
                let styles = {};

                // If this location has a building
                if (typeof buildings[cellId] !== 'undefined') {
                    classes.push('b');
                    Object.assign(styles, {
                        backgroundColor: buildings[cellId],
                    });
                }

                // If character is on this location
                if (this.props.character.location.x == x && this.props.character.location.y == y) {
                    classes.push('c');
                    Object.assign(styles, {
                        'backgroundColor': getStringColour(this.props.character.name),
                    });
                }

                cells.push(<div key={cellId} className={classnames(classes)} style={styles} />);
            }
            grid.push(<div key={y} className="y">{cells}</div>);
        }

        return grid;
    }

    render() {
        // if the character is not load, dont continue
        if (!this.props.character) {
            return null;
        }

        const location = this.props.location;
        const hasPlayers = location.players.length ? true : false;
        const hasItems = location.items.length ? true : false;
        const hasStructures = location.structures.length ? true : false;
        const hasNPCs = location.npcs.length ? true : false;

        return (
            <Card>
                <CardHeader>Location</CardHeader>
                <div id="map">
                    {this.renderMinimap()}
                </div>
                <CardBody>
                    <strong>Location:</strong> {this.props.maps[this.props.character.location.map].name}<br />
                    <strong>Compass:</strong> North {this.props.character.location.y} / East {this.props.character.location.x}<br/>
                    "{location.description}"<br/>
                    <div className="c-game__event-divider" />
                    {
                        hasStructures &&
                        <React.Fragment>
                            <strong className="infoheader">Buildings</strong>
                            <p>
                                {
                                    location.structures.map((structure, index) =>
                                        <React.Fragment key={index}>
                                            {
                                                index !== 0 &&
                                                <span>, </span>
                                            }
                                            <span
                                                className="e-clickable"
                                                style={{color: structure.colour}}
                                                onClick={() => this.showStructureInfo(structure)}
                                            >
                                                {structure.name}
                                            </span>
                                        </React.Fragment>
                                    )
                                }
                            </p>
                        </React.Fragment>
                    }
                    {
                        hasPlayers &&
                        <React.Fragment>
                            <strong className="infoheader">Players</strong>
                            <p>
                                {
                                    location.players.map((user, index) =>
                                        <React.Fragment key={user.user_id}>
                                            {
                                                index !== 0 &&
                                                <span>, </span>
                                            }
                                            <span>
                                                {user.name}
                                            </span>
                                        </React.Fragment>
                                    )
                                }
                            </p>
                        </React.Fragment>
                    }
                    {
                        hasNPCs &&
                        <React.Fragment>
                            <strong className="infoheader">NPCs</strong>
                            <p>
                                {
                                    location.npcs.map((NPC, index) =>
                                        <React.Fragment key={index}>
                                            {
                                                index !== 0 &&
                                                <span>, </span>
                                            }
                                            <span>
                                                {NPC.name} the {NPC.type} (HP: {NPC.health})
                                            </span>
                                        </React.Fragment>
                                    )
                                }
                            </p>
                        </React.Fragment>
                    }
                    {
                        hasItems &&
                        <React.Fragment>
                            <strong className="infoheader">Items on the ground</strong>
                            <p>
                                {
                                    location.items.map((item, index) => {
                                        if (item) {
                                            const itemObj = this.props.itemlist[item.id];

                                            return <React.Fragment key={index}>
                                                {
                                                    index !== 0 &&
                                                    <span>, </span>
                                                }
                                                {(itemObj.stats.stackable ? `(${item.durability}) ` : '')}{itemObj.name}
                                            </React.Fragment>;
                                        }
                                    })
                                }
                            </p>
                        </React.Fragment>
                    }
                </CardBody>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        maps: {...state.game.maps},
        location: {...state.location},
        itemlist: {...state.game.items},
        character: state.character.selected,
    };
}

function mapActionsToProps(dispatch) {
    return bindActionCreators({newEvent}, dispatch);
}

export default connect(mapStateToProps, mapActionsToProps)(PlayerMap);
