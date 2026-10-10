import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/homeservice-logo.jpg";

function ProviderSettings() {

    const navigate = useNavigate();

    const [name, setName] = useState(
        sessionStorage.getItem("name") || ""
    );

    const [saved, setSaved] = useState(false);


    const handleSave = () => {

        sessionStorage.setItem(
            "name",
            name
        );

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 2000);

    };


    return (

        <div className="provider-dashboard">


            {/* ================= HEADER ================= */}

            <header className="dashboard-header">

                <div className="header-brand">

                    <div className="app-logo">

                        <img
                            src={logo}
                            alt="Home Service"
                        />

                    </div>

                    <div>

                        <h1>
                            Home Service
                        </h1>

                        <p>
                            Settings
                        </p>

                    </div>

                </div>


                <button
                    type="button"
                    className="menu-button"
                    onClick={() =>
                        navigate("/provider")
                    }
                >
                    Back to Dashboard
                </button>

            </header>


            {/* ================= SETTINGS ================= */}

            <main className="provider-content">

                <div className="settings-card">

                    <h2>
                        Provider Settings
                    </h2>


                    <div className="settings-group">

                        <label>
                            Display Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your display name"
                        />

                    </div>


                    {saved && (

                        <div className="success-message">

                            Settings saved successfully.

                        </div>

                    )}


                    <button
                        type="button"
                        className="info-primary-button"
                        onClick={handleSave}
                    >
                        Save Changes
                    </button>

                </div>

            </main>

        </div>

    );
}

export default ProviderSettings;