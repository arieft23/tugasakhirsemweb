import React, { Component } from 'react';
import { Tabs, Tab, ListGroup, ListGroupItem, Modal, Button } from 'react-bootstrap';

const API = 'http://localhost:8001/api/index'
const APISpecies = 'http://localhost:8001/api/species/'

class IndexPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mammalia: [],
            pisces: [],
            sauropsida: [],
            reptilia: [],
            aves: [],
            modal: "",
            show: false
        };
    }

    componentWillMount() {
        let mammalia = []
        let pisces = []
        let sauropsida = []
        let reptilia = []
        let aves = []
        const urlFetch = fetch(API)
        urlFetch.then(res => {
            if (res.status === 200)
                return res.json()
        }).then(animals => {
            for (var i in animals) {
                switch (animals[i].classLabel.value) {
                    case "Mammalia":
                        mammalia.push(animals[i])
                        break
                    case "Pisces":
                        pisces.push(animals[i])
                        break
                    case "Sauropsida":
                        sauropsida.push(animals[i])
                        break
                    case "Reptilia":
                        reptilia.push(animals[i])
                        break
                    case "Aves":
                        aves.push(animals[i])
                        break
                }
            }
            this.setState({
                mammalia: mammalia,
                pisces: pisces,
                sauropsida: sauropsida,
                reptilia: reptilia,
                aves: aves
            })
        })
    }

    click(species) {
        const urlFetch = fetch(APISpecies + "/" + species)
        urlFetch.then(res => {
            if (res.status === 200)
                return res.json()
        }).then(animal => {
            this.setState({
                modal: {
                    speciesRagunan: animal.speciesRagunan,
                    nameRagunan: animal.nameRagunan,
                    overviewRagunan: animal.overviewRagunan,
                    nameWiki: animal.nameWikidata,
                    img: animal.imageWikidata,
                    gestationPeriod: animal.gestationPeriodWikidata,
                    conservationStatus: animal.conservationStatusWikidata
                },
                show : true
            })
            console.log(this.state.modal)

        })
    }

    handleClose(){
        this.setState({ show: false })
    }

    renderList(list) {
        let listRender = list.map(item => <ListGroupItem header={item.name.value} onClick={() => this.click(item.species.value)} >{item.species.value}</ListGroupItem>)

        return (
            listRender
        );
    }


    render() {
        return (
            <div className='wrap'>
                <Tabs defaultActiveKey={2} id="uncontrolled-tab-example">
                    <Tab eventKey={1} title="Mammalia">
                        <ListGroup>
                            {this.renderList(this.state.mammalia)}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey={2} title="Pisces">
                        <ListGroup>
                            {this.renderList(this.state.pisces)}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey={3} title="Aves">
                        <ListGroup>
                            {this.renderList(this.state.aves)}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey={4} title="Sauropsida">
                        <ListGroup>
                            {this.renderList(this.state.sauropsida)}
                        </ListGroup>
                    </Tab>
                    <Tab eventKey={5} title="Reptilia">
                        <ListGroup>
                            {this.renderList(this.state.reptilia)}
                        </ListGroup>
                    </Tab>
                </Tabs>
                <Modal show={this.state.show} onHide={()=> this.handleClose()}>
                    <Modal.Header>
                        <Modal.Title>{this.state.modal.nameRagunan}</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <h4>Species Name</h4>
                        <p>{this.state.modal.nameWiki}</p>
                        <img src={this.state.modal.img} alt={this.state.modal.nameWiki} style={{width:500,height:300}}/>
                        <hr/>

                        <h4>Overview</h4>
                        <p>{this.state.modal.overviewRagunan}</p>

                        <hr/>

                        <h4>Gestation Period</h4>
                        <p>{this.state.modal.gestationPeriod}</p>

                        <hr/>

                        <h4>Conservation Status</h4>
                        <p>{this.state.modal.conservationStatus}</p>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=> this.handleClose()}>Close</Button>
                        
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default IndexPage;
