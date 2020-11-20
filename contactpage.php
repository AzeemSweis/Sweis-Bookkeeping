<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Slab&family=Playfair+Display+SC&display=swap" rel="stylesheet">

    <!-- CSS Stylesheets -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
    <link rel="stylesheet" href="css/styles.css">

    <!-- Bootstrap Scripts -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js" integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI" crossorigin="anonymous"></script>
  </head>
  <body>
    <div class="container">
      <div class="row">
        <div class="col-xl-8 offset-xl-2 py-5">
          <h1>Contact Me</h1>
          <p class="lead">For any questions, inquires, etc. please do not hesitate to contact me.</p>
            <!-- We're going to place the form here in the next step -->
            <form id="contact-form" method="post" action="contact.php" role="form">

      <div class="messages"></div>

      <div class="controls">

          <div class="row">
              <div class="col-md-6">
                  <div class="form-group">
                      <label for="form_name">Firstname *</label>
                      <input id="form_name" type="text" name="name" class="form-control" placeholder="Please enter your first name" required="required" data-error="Firstname is required.">
                      <div class="help-block with-errors"></div>
                  </div>
              </div>
              <div class="col-md-6">
                  <div class="form-group">
                      <label for="form_lastname">Lastname *</label>
                      <input id="form_lastname" type="text" name="surname" class="form-control" placeholder="Please enter your last name" required="required" data-error="Lastname is required.">
                      <div class="help-block with-errors"></div>
                  </div>
              </div>
          </div>
          <div class="row">
              <div class="col-md-6">
                  <div class="form-group">
                      <label for="form_email">Email *</label>
                      <input id="form_email" type="email" name="email" class="form-control" placeholder="Please enter your email" required="required" data-error="Valid email is required.">
                      <div class="help-block with-errors"></div>
                  </div>
              </div>
              <!-- <div class="col-md-6">
                  <div class="form-group">
                      <label for="form_need">Please specify your need *</label>
                      <select id="form_need" name="need" class="form-control" required="required" data-error="Please specify your need.">
                          <option value=""></option>
                          <option value="Request quotation">Request quotation</option>
                          <option value="Request order status">Request order status</option>
                          <option value="Request copy of an invoice">Request copy of an invoice</option>
                          <option value="Other">Other</option>
                      </select>
                      <div class="help-block with-errors"></div>
                  </div>
              </div> -->
          </div>
          <div class="row">
              <div class="col-md-12">
                  <div class="form-group">
                      <label for="form_message">Message *</label>
                      <textarea id="form_message" name="message" class="form-control" placeholder="Please enter your message" rows="4" required="required" data-error="Please, leave us a message."></textarea>
                      <div class="help-block with-errors"></div>
                  </div>
              </div>
              <div class="col-md-12">
                  <input type="submit" class="btn btn-dark btn-send" value="Send message">
              </div>
          </div>
          <div class="row">
              <div class="col-md-12">
                  <p class="text-muted">
                      <strong>*</strong> These fields are required.</p>
              </div>
          </div>
      </div>

  </form>
        </div>
      </div>
    </div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/1000hz-bootstrap-validator/0.11.9/validator.min.js" integrity="sha256-dHf/YjH1A4tewEsKUSmNnV05DDbfGN3g7NMq86xgGh8=" crossorigin="anonymous"></script>
    <script src="contact.js"></script>
  </body>
</html>
