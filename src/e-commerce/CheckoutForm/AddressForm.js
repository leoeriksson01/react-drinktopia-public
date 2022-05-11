import React from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import "../../styles/CheckoutStyle.scss"

const AddressForm = ({ next }) => {
  const {
    register,
    handleSubmit,
    methods,
  } = useForm();
  return (
    <>
      <Typography variant="h6" gutterBottom>Frakt</Typography>
      <FormProvider {...methods}>
        <form className="addressForm" onSubmit={handleSubmit((data) => next({...data }))}>
          <Grid container spacing={3}>
          <select className="customFormGroup"{...register("shippingType", {required: true})}>
                    <option className="dropdownOption" value="">Fraktsätt...</option>
                    <option value="Postnord">Postnord</option>
                    <option value="Instabox">Instabox</option>
                    <option value="DHL">DHL</option>
                    <option value="Instabox">Instabox</option>
                    <option value="Budbee">Budbee</option>
                  </select>
          <input
                      className="customFormGroup"
                      {...register("firstName", { required: true })}
                      placeholder="förnamn"
                    />
                     <input
                      className="customFormGroup"
                      {...register("lastName", { required: true })}
                      placeholder="efternamn"
                    />
                      <input
                      className="customFormGroup"
                      {...register("country", { required: true })}
                      placeholder="land"
                    />
                     <input
                      className="customFormGroup"
                      {...register("address", { required: true })}
                      placeholder="adress"
                    />
                     <input
                      className="customFormGroup"
                      {...register("email", { required: true })}
                      placeholder="email"
                    />
                     <input
                      className="customFormGroup"
                      {...register("city", { required: true })}
                      placeholder="stad"
                    />
                     <input
                      className="customFormGroup"
                      {...register("zipcode", { required: true })}
                      placeholder="postnummer"
                    />
          </Grid>
          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} variant="outlined" to="/cart">Tillbaka</Button>
            <Button type="submit" variant="contained" color="primary">Nästa</Button>
          </div>
        </form>
        </FormProvider>
    </>
  );
};

export default AddressForm;