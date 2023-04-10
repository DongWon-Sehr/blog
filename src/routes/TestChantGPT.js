import { useState, useEffect } from "react";
import MenuBar from "../components/MenuBar";
import ModelList from "../components/ModelList";

function SearchResult({ modelInfo, usdRates }) {

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

    const [isLoading, setIsLoading] = useState(true);
    const [models, setModels] = useState([]);
    const [modelInfo, setModelInfo] = useState({});

    const { Configuration, OpenAIApi } = require("openai");
    const configiration = new Configuration({
        organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
        apiKey: process.env.REACT_APP_OPENAI_SECRET_KEY,
    });

    const openai = new OpenAIApi(configiration);

    const getModels = async () => {
        const response = await openai.listModels();
        const models = response.data.data;
        console.log(models);
        console.log("type: " + typeof models);
        setModels(models);
        setIsLoading(false);
    }

    useEffect(() => {
        getModels();
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

    return (
        <div>
            <MenuBar />
            <h1>Test ChatGPT API</h1>
            <h3>Support Models ({models.length})</h3>
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
                                {models.map((model, idx) => <option id={model.id} value={`${model.id} (${model.id})`} key={idx}>{`${model.id}`}</option>)}
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