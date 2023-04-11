import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";

function SearchResult({ modelInfo }) {

    const onSubmitMessageSend = (event) => {
        event.preventDefault();
        const targetInput = event.target.querySelector("input");
        targetInput.value="";
    };

    return (
        <div>
            <h3>{`Talk to ${modelInfo.id}`}</h3>
            <form onSubmit={onSubmitMessageSend}>
                <input
                    id="targetModel"
                    type="text"
                    placeholder="request text"
                />
                <button>Send</button>
            </form>
        </div>
    );
}

function TestChantGPT() {

    const { Configuration, OpenAIApi } = require("openai");

    const [isLoading, setIsLoading] = useState(true);
    const [isConnected, setIsConnected] = useState(false);
    const [openAIApi, setOpenAIApi] = useState({});
    const [models, setModels] = useState([]);
    const [modelInfo, setModelInfo] = useState({});

    const getOpenAIApi = async (apiKey, organization="") => {

        if ( ! organization ) organization = process.env.REACT_APP_OPENAI_ORGANIZATION;
        const configiration = new Configuration({
            organization: organization,
            apiKey: apiKey,
        });
    
        const _openAIApi = new OpenAIApi(configiration);
        try {
            await _openAIApi.listModels();
        } catch (e) {
            alert(e.response.data.error.message);
            return;
        }
        setOpenAIApi(_openAIApi);
        setIsConnected(true);
    }

    const getModels = async () => {
        if ( openAIApi ) {
            const response = await openAIApi.listModels();
            const models = response.data.data;
            console.log(models);
            setModels(models);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // getModels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeModel = (event) => {
        if (event.target.value === "") {
            return;
        }

        const selectedItem = document.querySelector("#model-list option[value='" + event.target.value + "']");
        let targetId = "";
        if (selectedItem) {
            targetId = selectedItem.id;
        }

        if (targetId) {
            event.target.id = targetId;
        }
        else {
            event.target.id = "no-select";
        }
    };

    const onSubmitSelectModel = (event) => {
        event.preventDefault();
        const targetInput = event.target.querySelector("input");
        const targetModel = models.filter((item) => item.id === targetInput.id);
        console.log(targetModel);
        if (targetModel.length > 0) {
            setModelInfo(targetModel[0]);
        } else {
            setModelInfo({});
        }
    };

    const onClickConnectOpenAI = (event) => { 
        event.preventDefault();
        const organizationIdInput = document.body.querySelector("#orgainzation-id");
        const apiKeyInput = document.body.querySelector("#apikey");
        const orgainzationId = organizationIdInput.value.trim();
        const apiKey = apiKeyInput.value.trim();
        getOpenAIApi(apiKey, orgainzationId); 
        organizationIdInput.value = "";
        apiKeyInput.value = "";
    };

    const onClickLoadModels = (event) => { getModels()};

    return (
        <div>
            <MenuBar />
            <h1>
                Test ChatGPT API
            </h1>
            <form>
                <input
                    type="text"
                    id="orgainzation-id"
                    size="50"
                    placeholder="Organization ID (leave it blank to use default ID)"
                />
                <br />
                <input
                    type="text"
                    id="apikey"
                    size="50"
                    placeholder="API Key"
                />
                <br />
                <button onClick={onClickConnectOpenAI}>Connect to OpenAI</button>
                <span> ... </span>
                { ! isConnected
                    ? (<font color="red">Disconnected</font>)
                    : (<font color="greed">Connected</font>)
                }
            </form>
            <h3>
                <span>Support Models ({models.length}) </span>
                {
                    isConnected
                    ? (<button onClick={onClickLoadModels}>Load Models</button>)
                    : (<button disabled onClick={onClickLoadModels}>Load Models</button>)
                }
            </h3>
            {isLoading
                ? (<h3>Loading models ...</h3>)
                : (
                    <div>
                        <form onSubmit={onSubmitSelectModel}>
                            <label htmlFor="model-input">Select Model</label><br />
                            <input
                                onChange={onChangeModel}
                                type="text"
                                list="model-list"
                                id="no-select"
                                size="35"
                            />
                            <datalist id="model-list">
                                {models.map((model, idx) => <option id={model.id} value={`${model.id}`} key={idx}>{`${model.id}`}</option>)}
                            </datalist>
                            <button>Search</button>
                        </form>
                        <hr />
                        {Object.keys(modelInfo).length
                            ? <SearchResult modelInfo={modelInfo} />
                            : "no match"}
                    </div>
                )
            }
        </div>
    );
}

console.log('running...');

export default TestChantGPT;