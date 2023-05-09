/* eslint-disable react/jsx-no-target-blank */
import MenuBar from "../components/MenuBar";
import { useState, useEffect } from "react";
import {createSession} from "better-sse";

// const session = await createSession(req, res);
// if (!session.isConnected) throw new Error('Not connected');

function SearchResult({ modelInfo, openAIApi }) {
    const [requestComplete, setRequestComplete] = useState(false);
    const [reponseText, setResponseText] = useState("");
    const [requestObj, setRequestObj] = useState("");
    const [completionObj, setCompletionObj] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [excutionTime, setExcutionTime] = useState("");

    const [temperature, setTemperature] = useState(1);
    const [maxTokens, setMaxTokens] = useState(16);
    const [topP, setTopP] = useState(1);
    const [frequencyPenalty, setFrequencyPenalty] = useState(0);
    const [presencePenalty, setPresencePenalty] = useState(0);
    const [nCompletion, setNCompletion] = useState(1);
    const [stream, setStream] = useState(false);
    const [systemQuery, setSystemQuery] = useState("주어진 키워드와 문장을 바탕으로 나의 취미활동을 10 줄 미만으로 자연스럽게 기록해줘");

    const preStyle = {
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        overflow: "auto",
    };

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
                const _requestObj = {
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
                    stream: stream
                };

                setRequestObj(_requestObj);
                setIsCreating(true);
                const start = new Date()
                const data = await openAIApi.createChatCompletion(_requestObj);
                const end = new Date() - start;
                setExcutionTime(`Execution time : ${(end/1000).toFixed(2)} secs`);
                setIsCreating(false);
                
                console.log("suceess to get response");
                console.log(data);
                setCompletionObj(data);
                let _response = data.data.choices[0].message.content;
                _response = _response.replaceAll(". ", ".\n");
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
        console.log("triggered onChangeTemperature" + Date.now());
        const defaultValue = 1;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTemperature(defaultValue);
        } else {
            setTemperature(changedValue);
        }
    }
    
    const onChangeMaxTokens = (event) => {
        console.log("triggered onChangeMaxTokens" + Date.now());
        const defaultValue = 16;
        const changedValue = parseInt(event.target.value);
        if ( changedValue > 2048 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTemperature(defaultValue);
        } else {
            setMaxTokens(changedValue);
        }
    }
    
    const onChangeTopP = (event) => {
        const defaultValue = 1;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2 || changedValue < 0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setTopP(defaultValue);
        } else {
            setTopP(changedValue);
        }
    }

    const onChangeFrequencyPenalty = (event) => {
        const defaultValue = 0;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2.0 || changedValue < -2.0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setFrequencyPenalty(defaultValue);
        } else {
            setFrequencyPenalty(changedValue);
        }
    }

    const onChangePresencePenalty = (event) => {
        const defaultValue = 0;
        const changedValue = parseFloat(event.target.value);
        if ( changedValue > 2.0 || changedValue < -2.0 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setPresencePenalty(defaultValue);
        } else {
            setPresencePenalty(changedValue);
        }
    }

    const onChangeNCompletion = (event) => {
        const defaultValue = 1;
        const changedValue = parseInt(event.target.value);
        if ( changedValue > 5 || changedValue < 1 ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setNCompletion(defaultValue);
        } else {
            setNCompletion(changedValue);
        }
    }

    const onChangeStream = (event) => {
        const defaultValue = false;
        const changedValue = event.target.value.toLowerCase();
        if ( ! ["true", "false"].includes(changedValue) ) {
            event.preventDefault();
            event.target.value = defaultValue;
            setStream(defaultValue);
        } else {
            setStream(changedValue === "true");
        }
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
                                    value={temperature}
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
                                    value={maxTokens}
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
                                    value={topP}
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
                                    value={frequencyPenalty}
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
                                    value={presencePenalty}
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
                                    value={nCompletion}
                                />
                                <span> (default: 1 / min: 1 / max: 5)</span>
                            </td>
                        </tr>
                        <tr>
                            <td>stream: </td>
                            <td>
                                <input
                                    type="radio"
                                    name="stream"
                                    value="false"
                                    style={{ width: "50px" }}
                                    onChange={onChangeStream}
                                    checked={stream === false}
                                />
                                <span> (false)</span>
                                <input
                                    type="radio"
                                    name="stream"
                                    value="true"
                                    style={{ width: "50px" }}
                                    onChange={onChangeStream}
                                    checked={stream === true}
                                />
                                <span> (true)</span>
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
                                    value={systemQuery}
                                />
                                <span> (role of system)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <h3>{`Template`}</h3>
            <form onSubmit={onSubmitMessageSend}>
                <table>
                    <tbody>
                        <tr>
                            <td>취미활동</td>
                            <td>
                                <textarea
                                    rows="2"
                                    cols="80"
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
                                    cols="80"
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
                                    cols="80"
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
                                    cols="80"
                                    placeholder="request keywords or sentences"
                                    data-theme="함께 취미활동을 한 사람"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>취미활동 내용</td>
                            <td>
                                <textarea
                                    rows="5"
                                    cols="80"
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
                { ! requestComplete && ! isCreating
                    ? (
                        <div>
                            <span>Output</span>
                            <br />
                            <textarea
                                disabled
                                rows="15"
                                cols="150"
                                value=""
                            />
                        </div>
                    )
                    : isCreating
                    ? (
                        <div>
                            <span>Output</span>
                            <br />
                            <textarea
                                disabled
                                rows="15"
                                cols="150"
                                value={`Wait a second! Writing is generating by ${modelInfo.id} ... `}
                            />
                        </div>
                    )
                    : (
                        <div>
                            <span>{excutionTime}</span>
                            <br />
                            <span>Token Usage</span>
                            <ul>
                                <li>{`prompt_tokens (request) : ${completionObj.data.usage.prompt_tokens}`}</li>
                                <li>{`completion_tokens (response) : ${completionObj.data.usage.completion_tokens}`}</li>
                                <li>{`total_tokens (total) : ${completionObj.data.usage.total_tokens}`}</li>
                            </ul>
                            
                            <span>Output</span>
                            <br />
                            <textarea
                                disabled
                                rows="15"
                                cols="150"
                                value={reponseText}
                            />
                            <table style={{width:"90%"}}>
                                <tbody>
                                    <tr>
                                        <td>Request</td>
                                        <td>Response</td>
                                    </tr>
                                    <tr>
                                        <td style={{width:"50%", verticalAlign:"top"}}>
                                            <pre style={preStyle}>
                                                {JSON.stringify(requestObj, null, 2)}
                                            </pre>
                                        </td>
                                        <td style={{width:"50%", verticalAlign:"top"}}>
                                            <pre style={preStyle}>
                                                {JSON.stringify(completionObj, null, 2)}
                                            </pre>
                                        </td>
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