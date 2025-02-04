import React, { useState } from "react";

const domainSearchBar = () => {
    const [mainKeyword, setMainKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    // Existing handler for the table
    const handleSearch = async () => {
        if (!mainKeyword.trim()) {
            message.warning("Please enter a valid domain.");
            return;
        }
        setLoading(true);
        setKeywords([]);
        try {
            const data = await fetchKeywords(mainKeyword);
            setKeywords(data);
        } catch (error: any) {
            message.error(error.message || "Error fetching domain");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Row justify="center" style={{ marginBottom: 24 }}>
                <Col xs={24} sm={20} md={14} lg={12}>
                    <Input
                        placeholder="Enter your domain"
                        value={mainKeyword}
                        onChange={(e) => setMainKeyword(e.target.value)}
                        style={{ maxWidth: 400, marginRight: 8 }}
                    />
                    <Button type="primary" onClick={handleSearch}>
                        Search
                    </Button>
                </Col>
            </Row>
        </>
    );
};

export default domainSearchBar;
