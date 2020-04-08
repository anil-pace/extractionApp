var React = require('react');

var UserFormLoginPage = React.createClass({
	render :function(){
		return(
				
					<form>
						<select>
							  <option value="volvo">Volvo</option>
							  <option value="saab">Saab</option>
							  <option value="mercedes">Mercedes</option>
							  <option value="audi">Audi</option>
						</select>

						<div className="form-group">
							<label for="username">User Name :</label>
    						<input type="text" class="form-control" id="username" placeholder="Enter Username" />
						</div>
						<div className="form-group">
							<label for="password">Password :</label>
    						<input type="Password" class="form-control" id="username" placeholder="Enter Password" />
						</div>
						<select>
							  <option value="volvo">Select Language</option>
							  <option value="saab">Saab</option>
							  <option value="mercedes">Mercedes</option>
							  <option value="audi">Audi</option>
						</select>
						<button type="submit" class="btn btn-default loginButton">Login</button>
					</form>
				
			);
	}
});

module.exports = UserFormLoginPage;