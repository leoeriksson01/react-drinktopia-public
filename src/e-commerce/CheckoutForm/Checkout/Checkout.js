import React, { useState, useEffect } from "react";
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    Divider,
} from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import useStyles from "./styles";
import { commerce } from "../../../lib/commerce";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";

function Checkout({ cart, onCaptureCheckout, order, error, refreshCart }) {
    const navigate = useNavigate();
    const [checkoutToken, setCheckoutToken] = useState(null);
    const steps = ["Frakt", "Betalning"];
    const classes = useStyles();
    const [activeStep, setActiveStep] = useState(0);
    const [shippingData, setShippingData] = useState({});
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (cart.id) {
            const generateToken = async () => {
                try {
                    const token = await commerce.checkout.generateToken(
                        cart.id,
                        { type: "cart" }
                    );

                    setCheckoutToken(token);
                } catch {
                    if (activeStep !== steps.length) navigate("/");
                }
            };

            generateToken();
        }
    }, [cart, activeStep, navigate, steps.length]);

    const nextStep = () =>
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () =>
        setActiveStep((prevActiveStep) => prevActiveStep - 1);

    const next = (data) => {
        setShippingData(data);

        nextStep();
    };

    // Ladda i 3 sekunder innan beställningen läggs till och carten töms

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true);
            commerce.cart.empty();
            refreshCart();
        }, 3000);
    };

    const Form = () =>
        activeStep === 0 ? (
            <AddressForm
                checkoutToken={checkoutToken}
                nextStep={nextStep}
                setShippingData={setShippingData}
                next={next}
            />
        ) : (
            <PaymentForm
                checkoutToken={checkoutToken}
                nextStep={nextStep}
                backStep={backStep}
                shippingData={shippingData}
                onCaptureCheckout={onCaptureCheckout}
                timeout={timeout}
            />
        );

    let Confirmation = () =>
        order.customer ? (
            <>
                <div>
                    <h5>
                        Tack för ditt köp, {order.customer.firstname}{" "}
                        {order.customer.lastname}!
                    </h5>
                    <Divider className={classes.divider} />
                    <Typography variant="subtitle2">
                        Beställningsreferens: {order.customer_reference}
                    </Typography>
                </div>
                <br />
                <Link className="emptyButton" to="/">
                    Hem
                </Link>
            </>
        ) : isFinished ? (
            <>
                <p>Tack för din beställning</p>
                <p>
                    Du kan se din beställning{" "}
                    <span
                        className="link"
                        onClick={() => navigate("/profil/orderhistorik")}
                    >
                        {" "}
                        här{" "}
                    </span>
                </p>
            </>
        ) : (
            <div className={classes.spinner}>
                <CircularProgress />
            </div>
        );

    if (error) {
        Confirmation = () => (
            <>
                <Typography variant="h5">Error: {error}</Typography>
                <br />
                <Link className="emptyButton" to="/">
                    Hem
                </Link>
            </>
        );
    }

    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <Confirmation />
                    ) : (
                        checkoutToken && <Form />
                    )}
                </Paper>
            </main>
        </>
    );
}

export default Checkout;
