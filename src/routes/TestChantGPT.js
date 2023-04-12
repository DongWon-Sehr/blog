import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";

function SearchResult({ modelInfo }) {
    const [textareas, setTextareas] = useState([]);
    const [textareaId, setTextareaId] = useState(0);

    const onSubmitMessageSend = (event) => {
        event.preventDefault();
        const targetInputs = event.target.querySelectorAll("textarea");
        alert("The feature will be updated soon");
        // targetInputs.forEach( _text_area => _text_area.value="");
    };

    const addTextArea = (event) => {
        if (event) event.preventDefault();
        setTextareas(
            [...textareas, 
            <div key={textareas.length} id={`textarea-${textareaId}`}>
                <textarea 
                    rows="2"
                    cols="50"
                    placeholder="request keywords or sentences"
                />
                <button onClick={(e) => removeTextarea(`textarea-${textareaId}`, e)}>-</button>
                <br />
            </div>
        ]);
        setTextareaId(textareaId + 1);

        console.log(`textareaId: ${textareaId}`);
        console.log(`textareas.length: ${textareas.length}`);
        console.log(`textareas:`);
        console.log(textareas);
    }

    const removeTextarea = (elementId, event) => {
        console.log("\n\n------ removeTextarea start");
        if (event) event.preventDefault();

        const target_div = document.body.querySelector(`#${elementId}`);
        const target_idx = textareas.indexOf(target_div);
        console.log(`textareas:`);
        console.log(textareas);

        let tmp_textarea = textareas;
        console.log(`tmp_textarea:`);
        console.log(tmp_textarea);

        console.log(`tmp_textarea[1]:`);
        console.log(tmp_textarea[1]);

        console.log(`target_idx: ${target_idx}`);

        console.log(`target_div:`);
        console.log(target_div);

        console.log("------ id check start");
        textareas.map(_el => console.log(_el.props.id) );
        console.log("------ id check end");
        
        setTextareas( textareas.splice(target_idx, 1) );

        console.log(`textareaId: ${textareaId}`);
        console.log(`textareas.length: ${textareas.length}`);
        console.log(`textareas:`);
        console.log(textareas);
    }

    useEffect(() => {
        addTextArea();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h3>{`Talk to ${modelInfo.id}`}</h3>
            <form onSubmit={onSubmitMessageSend}>
                {textareas.map((textarea, idx) => textarea )}
                <button onClick={addTextArea}>+</button>
                <button>Create Writing</button>
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