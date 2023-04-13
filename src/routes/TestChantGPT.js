import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";

function SearchResult({ modelInfo, openAIApi }) {
    const [temperature, setTemperature] = useState(1);
    const [maxTokens, setMaxTokens] = useState(16);
    const [requestComplete, setRequestComplete] = useState(false);
    const [reponse, setResponse] = useState("");

    const onSubmitMessageSend = async (event) => {
        event.preventDefault();
        const targetTextareas = event.target.querySelectorAll("textarea");

        const queryTextArr = [];
        targetTextareas.forEach(_text_area => {
            const _userInput = _text_area.value.trim();
            if (_userInput.length > 0) {
                queryTextArr.push(`${_text_area.dataset.theme}: ${_userInput}`);
            }
        });

        console.log(modelInfo.id);
        console.log(temperature);
        console.log(maxTokens);
        console.log(queryTextArr);
        let query = "";
        if ( queryTextArr.length > 0 ) {
            query = queryTextArr.join(" / ");
        }

        if (query.length > 0) {
            try {
                console.log("request to openAI");
                const completion = await openAIApi.createCompletion({
                    model: modelInfo.id,
                    messages: [
                        { role: "system", content: "주어진 키워드와 문장을 바탕으로 나의 취미활동을 10 줄 미만으로 자연스럽게 기록해줘" },
                        { role: "user", content: query },
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    n: 1,
                    stop: "",
                });
                
                console.log("suceess to get response");
                const _response = completion.data.choices[0].message.content;
                setResponse(_response);
                setRequestComplete(true);
            } catch (e) {
                if (e.response) {
                    alert(`${e.response.status}: ${e.response.data.error.message}`);
                    console.log(e.response);
                } else {
                    alert(e.message);
                }
            }
        }
    };

    const onChangeTemperature = (event) => {
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value=1;
            setTemperature(1);
        }
        setTemperature(changedValue);
    }

    const onKeyUpTemperature = (event) => {
        onChangeTemperature(event);
    }
    
    const onChangeMaxTokens = (event) => {
        const changedValue = parseInt(event.target.value);
        if ( changedValue > 2048 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value=16;
            setTemperature(16);
        }
        setMaxTokens(changedValue);
    }

    const onKeyUpMaxTokens = (event) => {
        onChangeMaxTokens(event);
    }

    useEffect(() => {
        // addTextarea();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <div>
                <h3>GPT Settings</h3>
                <table>
                    <tbody>
                        <tr>
                            <td>temperature: </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    placeholder="1"
                                    style={{ width: "50px" }}
                                    onChange={onChangeTemperature}
                                    onKeyUp={onKeyUpTemperature}
                                />
                                <span> (default: 1 / min: 0 / max: 2)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>max_tokens: </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="2048"
                                    step="1"
                                    placeholder="16"
                                    style={{ width: "50px" }}
                                    onChange={onChangeMaxTokens}
                                    onKeyUp={onKeyUpMaxTokens}
                                />
                                <span> (default: 16 / min: 0 / max: 2048)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>{`Talk to ${modelInfo.id}`}</h3>
            <form onSubmit={onSubmitMessageSend}>
                <table>
                    <tbody>
                        <tr>
                            <td>취미활동</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="50"
                                    placeholder="request keywords or sentences"
                                    data-theme="취미활동"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>날짜</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="50"
                                    placeholder="request keywords or sentences"
                                    data-theme="날짜"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>장소</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="50"
                                    placeholder="request keywords or sentences"
                                    data-theme="장소"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>함께 취미활동을 한 사람</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="50"
                                    placeholder="request keywords or sentences"
                                    data-theme="함께 취미활동을 한 사람"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>취미활동 내용</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="50"
                                    placeholder="request keywords or sentences"
                                    data-theme="취미활동 내용"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <br />
                <button>Create Writing</button>
            </form>

            <hr />
            <div>
                <h3>Result</h3>
                {!requestComplete
                    ? (<textarea
                        disabled
                        rows="15"
                        cols="150"
                        value="Wating for request ..."
                    />
                    )
                    : (<textarea
                        disabled
                        rows="15"
                        cols="150"
                        value={reponse}
                    />
                    )
                }
            </div>
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

    const getOpenAIApi = async (apiKey, organization = "") => {

        if (!organization) organization = process.env.REACT_APP_OPENAI_ORGANIZATION;
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
        if (openAIApi) {
            const response = await openAIApi.listModels();
            const models = response.data.data;
            console.log(models);
            setModels(models);
            setIsLoading(false);
        }
    }

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

    const onClickLoadModels = (event) => { getModels() };

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
                {!isConnected
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
                            ? <SearchResult modelInfo={modelInfo} openAIApi={openAIApi} />
                            : "no match"}
                    </div>
                )
            }
        </div>
    );
}

console.log('running...');

export default TestChantGPT;