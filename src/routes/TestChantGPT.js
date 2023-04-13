/* eslint-disable react/jsx-no-target-blank */
import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";

function SearchResult({ modelInfo, openAIApi }) {
    const [requestComplete, setRequestComplete] = useState(false);
    const [reponseText, setResponseText] = useState("");
    const [requestJson, setRequestJson] = useState("");
    const [completionJson, setCompletionJson] = useState("");

    const [temperature, setTemperature] = useState(1);
    const [maxTokens, setMaxTokens] = useState(16);
    const [topP, setTopP] = useState(1);
    const [frequencyPenalty, setFrequencyPenalty] = useState(0);
    const [presencePenalty, setPresencePenalty] = useState(0);
    const [nCompletion, setNCompletion] = useState(1);
    const [systemQuery, setSystemQuery] = useState("주어진 키워드와 문장을 바탕으로 나의 취미활동을 10 줄 미만으로 자연스럽게 기록해줘");

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
                const _requestJson = {
                    model: modelInfo.id,
                    messages: [
                        { role: "system", content: systemQuery },
                        { role: "user", content: query },
                    ],
                    temperature: temperature,
                    max_tokens: maxTokens,
                    top_p: topP,
                    frequency_penalty: frequencyPenalty,
                    presence_penalty: presencePenalty,
                    n: nCompletion,
                    stop: "",
                };

                setRequestJson(JSON.stringify(_requestJson, null, 2));
                const _completion = await openAIApi.createChatCompletion(_requestJson);
                
                console.log("suceess to get response");
                console.log(_completion);
                setCompletionJson(JSON.stringify(_completion, null, 2));
                let _response = _completion.data.choices[0].message.content;
                _response = _response.replace(". ", ".<br>");
                setResponseText(_response);
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
        const defaultValue = 1;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTemperature(defaultValue);
        }
        setTemperature(changedValue);
    }

    const onKeyUpTemperature = (event) => {
        onChangeTemperature(event);
    }
    
    const onChangeMaxTokens = (event) => {
        const defaultValue = 16;
        const changedValue = parseInt(event.target.value);
        if ( changedValue > 2048 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTemperature(defaultValue);
        }
        setMaxTokens(changedValue);
    }

    const onKeyUpMaxTokens = (event) => {
        onChangeMaxTokens(event);
    }
    
    const onChangeTopP = (event) => {
        const defaultValue = 1;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTopP(defaultValue);
        }
        setTopP(changedValue);
    }

    const onKeyUpTopP = (event) => {
        onChangeTopP(event);
    }

    const onChangeFrequencyPenalty = (event) => {
        const defaultValue = 0;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2.0 || changedValue < -2.0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setFrequencyPenalty(defaultValue);
        }
        setFrequencyPenalty(changedValue);
    }

    const onKeyUpFrequencyPenalty = (event) => {
        onChangeFrequencyPenalty(event);
    }

    const onChangePresencePenalty = (event) => {
        const defaultValue = 0;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2.0 || changedValue < -2.0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setPresencePenalty(defaultValue);
        }
        setPresencePenalty(changedValue);
    }

    const onKeyUpPresencePenalty = (event) => {
        onChangePresencePenalty(event);
    }

    const onChangeNCompletion = (event) => {
        const defaultValue = 1;
        const changedValue = parseInt(event.target.value);
        if ( changedValue > 5 || changedValue < 1 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setNCompletion(defaultValue);
        }
        setNCompletion(changedValue);
    }

    const onKeyUpNCompletion = (event) => {
        onChangeNCompletion(event);
    }
    
    const onChangeSystemQuery = (event) => {
        const defaultValue = "주어진 키워드와 문장을 바탕으로 나의 취미활동을 10 줄 미만으로 자연스럽게 기록해줘";
        const changedValue = event.target.value.trim();
        if ( changedValue.length < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setSystemQuery(defaultValue);
        }
        setSystemQuery(changedValue);
    }

    const onKeyUpSystemQuery = (event) => {
        onChangeSystemQuery(event);
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
                        <tr>
                            <td>top_p: </td>
                            <td>
                                <input
                                    type="number"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    placeholder="1"
                                    style={{ width: "50px" }}
                                    onChange={onChangeTopP}
                                    onKeyUp={onKeyUpTopP}
                                />
                                <span> (default: 1 / min: 0 / max: 2)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>frequency_penalty: </td>
                            <td>
                                <input
                                    type="number"
                                    min="-2.0"
                                    max="2.0"
                                    step="0.1"
                                    placeholder="0"
                                    style={{ width: "50px" }}
                                    onChange={onChangeFrequencyPenalty}
                                    onKeyUp={onKeyUpFrequencyPenalty}
                                />
                                <span> (default: 0 / min: -2.0 / max: 2.0)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>presence_penalty: </td>
                            <td>
                                <input
                                    type="number"
                                    min="-2.0"
                                    max="2.0"
                                    step="0.1"
                                    placeholder="0"
                                    style={{ width: "50px" }}
                                    onChange={onChangePresencePenalty}
                                    onKeyUp={onKeyUpPresencePenalty}
                                />
                                <span> (default: 0 / min: -2.0 / max: 2.0)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>n_completion: </td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="1"
                                    placeholder="1"
                                    style={{ width: "50px" }}
                                    onChange={onChangeNCompletion}
                                    onKeyUp={onKeyUpNCompletion}
                                />
                                <span> (default: 1 / min: 1 / max: 5)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>system message (request): </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="주어진 키워드와 문장을 바탕으로 나의 취미활동을 10 줄 미만으로 자연스럽게 기록해줘"
                                    style={{ width: "800px" }}
                                    onChange={onChangeSystemQuery}
                                    onKeyUp={onKeyUpSystemQuery}
                                />
                                <span> (role of system)</span>
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
                    : (
                    <div>
                        <textarea
                            disabled
                            rows="15"
                            cols="150"
                            value={reponseText}
                        />
                        <table>
                            <tbody>
                                <tr>
                                    <td>Request</td>
                                    <td>Response</td>
                                </tr>
                                <tr>
                                    <td><pre>{requestJson}</pre></td>
                                    <td><pre>{completionJson}</pre></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
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
                <span color="grey"> Don't know your ID? <a href="https://platform.openai.com/account/org-settings" target="_blank">check it here</a>
                </span>
                <br />
                <input
                    type="text"
                    id="apikey"
                    size="50"
                    placeholder="API Key"
                />
                <span color="grey"> Don't know your Key? <a href="https://platform.openai.com/account/api-keys" target="_blank">check it here</a>
                </span>
                
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