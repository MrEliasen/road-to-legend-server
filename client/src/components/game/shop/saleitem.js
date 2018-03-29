import React from 'react';
import {connect} from 'react-redux';
import Item from './item';

// UI
import {Card} from 'reactstrap';

class SaleItem extends React.Component {
    constructor(props) {
        super(props);
    }

    renderNotification(canBuyExp, canBuyMoney) {
        let message = '';

        if (canBuyExp && canBuyMoney) {
            return null;
        }

        if (!canBuyMoney) {
            message = 'Not Enough Money';
        }

        if (!canBuyExp) {
            message = 'Not Enough EXP';
        }

        return <p className="notification">{message}</p>;
    }

    render() {
        const {shopItem, shopFingerprint, character} = this.props;
        const itemObj = this.props.itemList[shopItem.id];

        // if the item is no longer available in the game, ignore it.
        if (!itemObj) {
            return null;
        }

        const canBuyExp = shopItem.expRequired <= character.stats.exp;
        const canBuyMoney = shopItem.price <= character.stats.money;

        return (
            <Card className={'sale-item' + (!canBuyExp || !canBuyMoney ? ' --cant-buy' : '')}>
                {
                    this.renderNotification(canBuyExp, canBuyMoney)
                }
                <div className="item-details">
                    <Item
                        shopItem={shopItem}
                        shopFingerprint={shopFingerprint}
                        itemObj={itemObj} />
                    <div>
                        {shopItem.name}<br/>
                        Cost: {shopItem.price}
                    </div>
                </div>
            </Card>
        );
    }
}

function mapStateToProps(state) {
    return {
        itemList: state.game.items,
        character: state.character.selected,
    };
}

export default connect(mapStateToProps)(SaleItem);
